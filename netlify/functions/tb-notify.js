// Netlify Function — приём HTTP-нотификаций T-Business (T-Bank) о статусах платежей
// T-Bank шлёт POST на этот URL при смене статуса; в ответ ждёт строку "OK" (200).
// Requires env vars: TB_PASSWORD (+ TG_BOT_TOKEN, TG_CHAT_ID, RESEND_API_KEY, FROM_EMAIL)

import { createHash } from 'crypto';
import { connectLambda, getStore } from '@netlify/blobs';
import { safeEqual } from '../lib/guard.js';

const CRM_URL = 'https://script.google.com/macros/s/AKfycbwAttP0aT4mD9bg5VNydcSVQm0h-YD9bslp_Xr-6uNUGv18bEWiTxqCLK5WJeUe2GRP/exec';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const TB_PASSWORD = process.env.TB_PASSWORD;
  if (!TB_PASSWORD) {
    return { statusCode: 500, body: 'Not configured' };
  }

  if ((event.body || '').length > 20000) {
    return { statusCode: 413, body: 'Too large' };
  }

  let n;
  try {
    n = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }
  if (!n || typeof n !== 'object' || Array.isArray(n)) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  // Проверка подписи: SHA-256 от значений всех корневых скалярных полей
  // (кроме Token, вложенные объекты не участвуют) + Password, сортировка по ключу.
  // Булевы значения сериализуются как "true"/"false".
  const scalars = {};
  for (const [k, v] of Object.entries(n)) {
    if (k === 'Token' || v === null || typeof v === 'object') continue;
    scalars[k] = typeof v === 'boolean' ? (v ? 'true' : 'false') : String(v);
  }
  scalars.Password = TB_PASSWORD;
  const expected = createHash('sha256')
    .update(Object.keys(scalars).sort().map((k) => scalars[k]).join(''), 'utf8')
    .digest('hex');

  if (!n.Token || !safeEqual(expected, String(n.Token).toLowerCase())) {
    console.error('TB notify: bad token', JSON.stringify({ OrderId: n.OrderId, Status: n.Status }));
    return { statusCode: 403, body: 'Bad token' };
  }

  const amountRub = n.Amount ? n.Amount / 100 : '?';

  // T-Bank не присылает контакт в нотификации — берём из blob-хранилища по OrderId
  // (сохранён в tb-init). Fallback на пустой объект, если запись не найдена.
  let data = {};
  let store = null;
  let info = null;
  try {
    connectLambda(event);
    store = getStore('sa-payments');
    info = await store.get(String(n.OrderId), { type: 'json' });
    if (info) data = { Name: info.name, Email: info.email, Phone: info.phone, Product: info.product };
  } catch (e) {
    console.error('Blob lookup failed:', e.message);
  }

  // Банк повторяет уведомление, если не получил ответ. Чтобы клиент не получил два письма,
  // а в CRM не появилось две строки, запоминаем, что оплата уже обработана.
  if (n.Status === 'CONFIRMED' && info && info.confirmedAt) {
    return { statusCode: 200, body: 'OK' };
  }
  // Сумма в уведомлении должна совпасть с ценой, которую мы сами отправили в банк
  const amountMismatch = Boolean(info && info.amount && Number(n.Amount) !== Number(info.amount));

  // «Старт» = самостоятельный продукт, клиенту нужны коды Gallup.
  // Остальное (консультации, коучинг, профориентация) = живая сессия, нужно согласовать время.
  const isSelfServe = data.Product === 'Старт с сильных сторон';

  if (n.Status === 'CONFIRMED') {
    await Promise.allSettled([
      notifyTelegram(
        [
          `💳 <b>ОПЛАТА ПОЛУЧЕНА</b>`,
          ``,
          data.Product && `<b>Продукт:</b> ${escapeHtml(data.Product)}`,
          `<b>Сумма:</b> ${amountRub} ₽`,
          `<b>Заказ:</b> <code>${escapeHtml(n.OrderId || '')}</code>`,
          data.Name && `<b>Имя:</b> ${escapeHtml(data.Name)}`,
          data.Email && `<b>Email:</b> ${escapeHtml(data.Email)}`,
          data.Phone && `<b>Телефон:</b> ${escapeHtml(data.Phone)}`,
          n.Pan && `<b>Карта:</b> ${escapeHtml(n.Pan)}`,
          amountMismatch && `⚠️ <b>Сумма не совпадает с ценой продукта (${info.amount / 100} ₽). Проверь платёж в кабинете банка.</b>`,
          ``,
          isSelfServe
            ? `👉 Что делать: купить код Gallup и отправить клиенту в течение 24 ч. Отправка: strengthsacademy.ru/admin, карточка этой оплаты, кнопка «Отправить коды Gallup».`
            : `👉 Что делать: связаться с клиентом в течение 24 ч и согласовать время сессии (по почте или телефону выше).`,
          data.Email && `Письмо «оплата получена» клиенту уже ушло автоматически.`
        ].filter(Boolean).join('\n')
      ),
      fetch(CRM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          type: 'payment_success',
          key: process.env.CRM_SERVICE_KEY || '',
          name: data.Name || '',
          // CRM принимает contact = ТОЛЬКО чистый email/телефон; карту и телефон кладём в заметки
          contact: data.Email || '',
          source: `${data.Product ? data.Product + ' · ' : ''}${n.OrderId} · ${amountRub} ₽`,
          notes: [data.Phone && `тел: ${data.Phone}`, n.Pan && `карта: ${n.Pan}`].filter(Boolean).join(', ')
        }),
        redirect: 'follow'
      }),
      data.Email ? sendConfirmationEmail(data.Email, data.Name, amountRub, n.OrderId, isSelfServe, data.Product) : Promise.resolve()
    ]);
    if (store && info) {
      await store.setJSON(String(n.OrderId), { ...info, confirmedAt: new Date().toISOString() })
        .catch((e) => console.error('Blob update failed:', e.message));
    }
  } else if (['REJECTED', 'REFUNDED', 'PARTIAL_REFUNDED', 'DEADLINE_EXPIRED'].includes(n.Status)) {
    await notifyTelegram(
      `⚠️ <b>Платёж: ${escapeHtml(n.Status)}</b>\n\n<b>Заказ:</b> <code>${escapeHtml(n.OrderId || '')}</code>\n<b>Сумма:</b> ${amountRub} ₽${data.Email ? `\n<b>Email:</b> ${escapeHtml(data.Email)}` : ''}`
    ).catch(() => {});
  }
  // Промежуточные статусы (AUTHORIZED, FORM_SHOWED и т.п.) просто подтверждаем

  return { statusCode: 200, body: 'OK' };
};

async function sendConfirmationEmail(email, name, amountRub, orderId, isSelfServe, product) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL;
  if (!key || !from) return;
  const nextSteps = isSelfServe
    ? `В течение <b>24 часов</b> мы отправим на эту почту коды доступа и подробную инструкцию по прохождению теста Gallup CliftonStrengths.`
    : `В течение <b>24 часов</b> мы свяжемся с вами, чтобы согласовать удобное время и рассказать о следующих шагах.`;
  const safeName = escapeHtml(String(name || '').trim());
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from,
      to: [email],
      subject: 'Оплата получена — Strengths Academy',
      html: `<!doctype html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Оплата получена</title></head>
<body style="margin:0; padding:0; background:#f5f7f8; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#004452;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7f8; padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 2px 24px rgba(0,68,82,0.08);">
        <tr>
          <td style="background:#004452; padding:32px; text-align:center;">
            <div style="display:inline-block; width:44px; height:44px; line-height:44px; background:#fff1ad; color:#004452; border-radius:12px; font-weight:900; font-style:italic; font-size:18px; margin-bottom:16px;">SA</div>
            <div style="font-size:13px; font-weight:900; letter-spacing:2px; text-transform:uppercase; color:#AECD65; margin-bottom:8px;">Платёж прошёл</div>
            <div style="font-size:26px; font-weight:900; font-style:italic; text-transform:uppercase; letter-spacing:-1px; color:#ffffff; line-height:1.1;">
              Спасибо за <span style="color:#fff1ad;">оплату!</span>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px 0; font-size:16px; line-height:1.6;">${safeName ? `Здравствуйте, <b>${safeName}</b>!` : 'Здравствуйте!'}</p>
            <p style="margin:0 0 20px 0; font-size:15px; color:#374151; line-height:1.7;">
              Мы получили вашу оплату${product ? ` за «<b>${escapeHtml(product)}</b>»` : ''} на сумму <b>${amountRub} ₽</b>.
            </p>
            <div style="background:#f5f7f8; border-radius:16px; padding:18px 24px; margin:0 0 20px 0;">
              <div style="font-size:11px; font-weight:900; letter-spacing:2px; text-transform:uppercase; color:#004452; opacity:0.6; margin-bottom:6px;">Что дальше</div>
              <p style="margin:0; font-size:15px; color:#374151; line-height:1.7;">${nextSteps}</p>
            </div>
            <p style="margin:0 0 4px 0; font-size:13px; color:#6b7280;">Номер заказа: <b>${escapeHtml(orderId || '')}</b></p>
            <p style="margin:16px 0 0 0; font-size:14px; color:#374151; line-height:1.7;">
              Вопросы — просто ответьте на это письмо или напишите в Telegram: <a href="https://t.me/strengthsacademy_bot" style="color:#0a9396; font-weight:bold;">@strengthsacademy_bot</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 32px 32px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #e5e7eb;">
              <tr><td style="padding-top:20px;">
                <p style="margin:0 0 6px 0; font-size:13px; font-weight:700;">Strengths Academy</p>
                <p style="margin:0; font-size:12px; color:#6b7280; line-height:1.6;">
                  <a href="https://www.strengthsacademy.ru" style="color:#0a9396; text-decoration:none;">strengthsacademy.ru</a> ·
                  Telegram: <a href="https://t.me/strengths_academy" style="color:#0a9396; text-decoration:none;">@strengths_academy</a>
                </p>
              </td></tr>
            </table>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
      reply_to: 'strengthsacademy.ru@gmail.com'
    })
  });
}

async function notifyTelegram(text) {
  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;
  if (!token || !chatId) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true })
  });
}

function escapeHtml(s) {
  return String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
}
