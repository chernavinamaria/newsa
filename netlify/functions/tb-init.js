// Netlify Function — создание платежа T-Business (T-Bank Merchant API v2, метод Init)
// Requires env vars in Netlify: TB_TERMINAL_KEY, TB_PASSWORD (+ TG_BOT_TOKEN, TG_CHAT_ID для алертов)

import { createHash } from 'crypto';
import { connectLambda, getStore } from '@netlify/blobs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

const SITE_URL = 'https://www.strengthsacademy.ru';
const BACKEND_URL = 'https://sa-api-backend.netlify.app/.netlify/functions';
const CRM_URL = 'https://script.google.com/macros/s/AKfycbxEZl8aNXzVz1GYI06UN4zJvw2Z2hcedpHAmQog1sqc47LgrshJnrVFaUcX5O0YPHaM/exec';

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
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };
  }

  const TB_TERMINAL_KEY = process.env.TB_TERMINAL_KEY;
  const TB_PASSWORD = process.env.TB_PASSWORD;
  if (!TB_TERMINAL_KEY || !TB_PASSWORD) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Payment not configured' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: CORS, body: 'Invalid JSON' };
  }

  const { productId, name, email, phone } = payload;
  const product = CATALOG[productId];
  if (!product) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Unknown product' }) };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid email' }) };
  }

  const orderId = `SA-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  // T-Bank НЕ возвращает DATA в нотификациях — сохраняем контакт клиента сами,
  // чтобы при подтверждении оплаты знать, кому слать коды и письмо.
  try {
    connectLambda(event);
    const store = getStore('sa-payments');
    await store.setJSON(orderId, {
      name: String(name || '').slice(0, 100),
      email: String(email).slice(0, 100),
      phone: String(phone || '').slice(0, 30),
      product: product.title,
      amount: product.amount
    });
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
    DATA: {
      Name: String(name || '').slice(0, 100),
      Email: String(email).slice(0, 100),
      Phone: String(phone || '').slice(0, 30)
    }
    // TODO при переходе на боевой терминал: если включена онлайн-касса (54-ФЗ),
    // добавить Receipt { Email, Taxation: 'usn_income', Items: [...] }
  };

  let tb;
  try {
    const resp = await fetch('https://securepay.tinkoff.ru/v2/Init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    tb = await resp.json();
  } catch (e) {
    return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'T-Bank unreachable', details: e.message }) };
  }

  if (!tb.Success || !tb.PaymentURL) {
    console.error('TB Init failed:', JSON.stringify(tb));
    return {
      statusCode: 502,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: tb.Message || 'Init failed', details: tb.Details || '' })
    };
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
        name: name || '',
        contact: [email, phone].filter(Boolean).join(' / '),
        source: `${product.title} · ${product.amount / 100} ₽ · ${orderId}`
      }),
      redirect: 'follow'
    })
  ]);

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, paymentUrl: tb.PaymentURL, orderId })
  };
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

function escapeHtml(s) {
  return String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
}
