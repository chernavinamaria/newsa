// Netlify Function — приём HTTP-нотификаций T-Business (T-Bank) о статусах платежей
// T-Bank шлёт POST на этот URL при смене статуса; в ответ ждёт строку "OK" (200).
// Requires env vars: TB_PASSWORD (+ TG_BOT_TOKEN, TG_CHAT_ID, RESEND_API_KEY, FROM_EMAIL)

import { createHash } from 'crypto';
import { connectLambda, getStore } from '@netlify/blobs';

const CRM_URL = 'https://script.google.com/macros/s/AKfycbxEZl8aNXzVz1GYI06UN4zJvw2Z2hcedpHAmQog1sqc47LgrshJnrVFaUcX5O0YPHaM/exec';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const TB_PASSWORD = process.env.TB_PASSWORD;
  if (!TB_PASSWORD) {
    return { statusCode: 500, body: 'Not configured' };
  }

  let n;
  try {
    n = JSON.parse(event.body || '{}');
  } catch {
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

  if (!n.Token || expected !== String(n.Token).toLowerCase()) {
    console.error('TB notify: bad token', JSON.stringify({ OrderId: n.OrderId, Status: n.Status }));
    return { statusCode: 403, body: 'Bad token' };
  }

  const amountRub = n.Amount ? n.Amount / 100 : '?';

  // T-Bank не присылает контакт в нотификации — берём из blob-хранилища по OrderId
  // (сохранён в tb-init). Fallback на пустой объект, если запись не найдена.
  let data = {};
  try {
    connectLambda(event);
    const store = getStore('sa-payments');
    const info = await store.get(n.OrderId, { type: 'json' });
    if (info) data = { Name: info.name, Email: info.email, Phone: info.phone, Product: info.product };
  } catch (e) {
    console.error('Blob lookup failed:', e.message);
  }

  // «Старт» = самостоятельный продукт, клиенту нужны коды Gallup.
  // Остальное (консультации, коучинг, профориентация) = живая сессия, нужно согласовать время.
  const isSelfServe = data.Product === 'Старт с сильных сторон';

  if (n.Status === 'CONFIRMED') {
    await Promise.allSettled([
      notifyTelegram(
        [
          `✅ <b>ОПЛАТА ПОЛУЧЕНА</b>`,
          ``,
          data.Product && `<b>Продукт:</b> ${escapeHtml(data.Product)}`,
          `<b>Сумма:</b> ${amountRub} ₽`,
          `<b>Заказ:</b> <code>${escapeHtml(n.OrderId || '')}</code>`,
          data.Name && `<b>Имя:</b> ${escapeHtml(data.Name)}`,
          data.Email && `<b>Email:</b> ${escapeHtml(data.Email)}`,
          data.Phone && `<b>Телефон:</b> ${escapeHtml(data.Phone)}`,
          n.Pan && `<b>Карта:</b> ${escapeHtml(n.Pan)}`,
          ``,
          isSelfServe
            ? `👉 Не забудь купить код Gallup и отправить клиенту в течение 24ч`
            : `👉 Свяжись с клиентом в течение 24ч — согласовать время сессии`
        ].filter(Boolean).join('\n')
      ),
      fetch(CRM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          type: 'payment_success',
          name: data.Name || '',
          contact: [data.Email, data.Phone].filter(Boolean).join(' / ') || (n.Pan || ''),
          source: `${n.OrderId} · ${amountRub} ₽ · PaymentId ${n.PaymentId}`
        }),
        redirect: 'follow'
      }),
      data.Email ? sendConfirmationEmail(data.Email, data.Name, amountRub, n.OrderId, isSelfServe, data.Product) : Promise.resolve()
    ]);
  } else if (['REJECTED', 'REFUNDED', 'PARTIAL_REFUNDED', 'DEADLINE_EXPIRED'].includes(n.Status)) {
    await notifyTelegram(
      `⚠️ <b>Платёж: ${n.Status}</b>\n\n<b>Заказ:</b> <code>${escapeHtml(n.OrderId || '')}</code>\n<b>Сумма:</b> ${amountRub} ₽${data.Email ? `\n<b>Email:</b> ${escapeHtml(data.Email)}` : ''}`
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
    ? `В течение <b>24 часов</b> мы отправим на эту почту коды доступа и инструкции по прохождению теста Gallup CliftonStrengths.`
    : `В течение <b>24 часов</b> мы свяжемся с вами, чтобы согласовать удобное время и рассказать о следующих шагах.`;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from,
      to: [email],
      subject: 'Оплата получена — Strengths Academy',
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1a1a2e">
          <h2 style="text-transform:uppercase;font-style:italic">Спасибо за оплату!</h2>
          <p>${name ? escapeHtml(name) + ', мы' : 'Мы'} получили вашу оплату${product ? ` за «<b>${escapeHtml(product)}</b>»` : ''} на сумму <b>${amountRub} ₽</b> (заказ <b>${escapeHtml(orderId || '')}</b>).</p>
          <p>${nextSteps}</p>
          <p>Если есть вопросы — пишите в Telegram: <a href="https://t.me/strengthsacademy_bot">@strengthsacademy_bot</a></p>
          <p style="color:#888;font-size:12px;margin-top:32px">Strengths Academy · <a href="https://www.strengthsacademy.ru" style="color:#888">strengthsacademy.ru</a></p>
        </div>`
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
