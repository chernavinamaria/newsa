// Netlify Function — создание платежа T-Business (T-Bank Merchant API v2, метод Init)
// Requires env vars in Netlify: TB_TERMINAL_KEY, TB_PASSWORD (+ TG_BOT_TOKEN, TG_CHAT_ID для алертов)

import { createHash, randomBytes } from 'crypto';
import { connectLambda, getStore } from '@netlify/blobs';
import { precheck, parseBody, json, clean, isEmail, escapeHtml, tooMany } from '../lib/guard.js';

const SITE_URL = 'https://www.strengthsacademy.ru';
const BACKEND_URL = 'https://sa-api-backend.netlify.app/.netlify/functions';
const CRM_URL = 'https://script.google.com/macros/s/AKfycbwAttP0aT4mD9bg5VNydcSVQm0h-YD9bslp_Xr-6uNUGv18bEWiTxqCLK5WJeUe2GRP/exec';

// Цены только на сервере — сумма с клиента не принимается (защита от подмены)
const CATALOG = {
  'start':           { title: 'Старт с сильных сторон',        amount: 10000 * 100 },
  'career-consult':  { title: 'Карьерное консультирование',    amount: 50000 * 100 },
  'career-coaching': { title: 'Карьерный коучинг',             amount: 40000 * 100 },
  'teens':           { title: 'Профориентация подростков 16+', amount: 70000 * 100 }
};

// Подпись запроса: SHA-256 от конкатенации значений корневых скалярных параметров
// (+ Password), отсортированных по имени ключа. Вложенные объекты (DATA) не участвуют.
function tbToken(params, password) {
  const src = { ...params, Password: password };
  const str = Object.keys(src).sort().map((k) => String(src[k])).join('');
  return createHash('sha256').update(str, 'utf8').digest('hex');
}

export const handler = async (event) => {
  const rejected = precheck(event);
  if (rejected) return rejected;

  const TB_TERMINAL_KEY = process.env.TB_TERMINAL_KEY;
  const TB_PASSWORD = process.env.TB_PASSWORD;
  if (!TB_TERMINAL_KEY || !TB_PASSWORD) return json(event, 500, { error: 'Payment not configured' });

  const payload = parseBody(event);
  if (!payload) return json(event, 400, { error: 'Invalid JSON' });

  const productId = clean(payload.productId, 40);
  const name = clean(payload.name, 100);
  const email = clean(payload.email, 100);
  const phone = clean(payload.phone, 30);
  const product = Object.prototype.hasOwnProperty.call(CATALOG, productId) ? CATALOG[productId] : null;
  if (!product) return json(event, 400, { error: 'Unknown product' });
  if (!isEmail(email)) return json(event, 400, { error: 'Invalid email' });

  // Каждый созданный платёж уходит в банк, в Telegram и в CRM, поэтому ограничиваем частоту:
  // с одного адреса 6 за 10 минут, всего 40 в час.
  if (await tooMany(event, 'tb-init', [
    { by: 'ip', limit: 6, windowSec: 600 },
    { by: 'all', limit: 40, windowSec: 3600 }
  ])) {
    return json(event, 429, { error: 'Слишком много попыток оплаты. Попробуйте через несколько минут или напишите нам.' });
  }

  const orderId = `SA-${Date.now()}-${randomBytes(4).toString('hex')}`;

  // T-Bank НЕ возвращает DATA в нотификациях — сохраняем контакт клиента сами,
  // чтобы при подтверждении оплаты знать, кому слать коды и письмо.
  try {
    connectLambda(event);
    const store = getStore('sa-payments');
    await store.setJSON(orderId, { name, email, phone, product: product.title, amount: product.amount });
  } catch (e) {
    console.error('Blob store failed (payment continues):', e.message);
  }

  const params = {
    TerminalKey: TB_TERMINAL_KEY,
    Amount: product.amount,
    OrderId: orderId,
    Description: product.title,
    SuccessURL: `${SITE_URL}/payment-success`,
    FailURL: `${SITE_URL}/payment-fail`,
    NotificationURL: `${BACKEND_URL}/tb-notify`
  };

  const body = {
    ...params,
    Token: tbToken(params, TB_PASSWORD),
    DATA: { Name: name, Email: email, Phone: phone }
  };

  // Чек по 54-ФЗ. Включается переменной TB_TAXATION в Netlify (например usn_income).
  // Пока она не задана — терминал демо, кассы нет, Receipt не отправляем.
  // Receipt, как и DATA, вложенный объект и в расчёте Token не участвует.
  if (process.env.TB_TAXATION) {
    body.Receipt = {
      Email: email,
      Taxation: process.env.TB_TAXATION,
      Items: [
        {
          Name: product.title.slice(0, 128),
          Price: product.amount,
          Quantity: 1,
          Amount: product.amount,
          // На УСН НДС не начисляется
          Tax: process.env.TB_VAT || 'none',
          PaymentMethod: 'full_prepayment',
          PaymentObject: 'service'
        }
      ]
    };
    if (phone) body.Receipt.Phone = phone;
  }

  let tb;
  try {
    const resp = await fetch('https://securepay.tbank.ru/v2/Init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    tb = await resp.json();
  } catch (e) {
    console.error('TB Init unreachable:', e.message);
    return json(event, 502, { error: 'Банк временно недоступен. Попробуйте позже.' });
  }

  if (!tb.Success || !tb.PaymentURL) {
    console.error('TB Init failed:', JSON.stringify(tb));
    return json(event, 502, { error: 'Не удалось создать платёж. Попробуйте позже или напишите нам.' });
  }

  // Алерт в Telegram + запись в CRM (не блокируют ответ при ошибке)
  await Promise.allSettled([
    notifyTelegram(
      [
        `🟡 <b>Создан платёж</b>`,
        ``,
        `<b>Продукт:</b> ${escapeHtml(product.title)}`,
        `<b>Сумма:</b> ${product.amount / 100} ₽`,
        name && `<b>Имя:</b> ${escapeHtml(name)}`,
        `<b>Email:</b> ${escapeHtml(email)}`,
        phone && `<b>Телефон:</b> ${escapeHtml(phone)}`,
        `<b>Заказ:</b> <code>${orderId}</code>`
      ].filter(Boolean).join('\n')
    ),
    fetch(CRM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        type: 'payment_init',
        // Строки об оплате CRM принимает только с этим ключом (с сайта их подделать нельзя)
        key: process.env.CRM_SERVICE_KEY || '',
        name,
        // ВАЖНО: CRM принимает contact = ТОЛЬКО чистый email или телефон (не "email / телефон")
        contact: email,
        source: `${product.title} · ${product.amount / 100} ₽ · ${orderId}`,
        notes: phone ? `тел: ${phone}` : ''
      }),
      redirect: 'follow'
    })
  ]);

  return json(event, 200, { ok: true, paymentUrl: tb.PaymentURL, orderId });
};

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
