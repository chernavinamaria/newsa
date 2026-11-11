// Netlify Function — forwards form submissions to Telegram bot
// Requires env vars in Netlify: TG_BOT_TOKEN, TG_CHAT_ID

import { precheck, parseBody, json, clean, escapeHtml, tooMany } from '../lib/guard.js';

export const handler = async (event) => {
  const rejected = precheck(event);
  if (rejected) return rejected;

  const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
  const TG_CHAT_ID = process.env.TG_CHAT_ID;
  if (!TG_BOT_TOKEN || !TG_CHAT_ID) return json(event, 500, { error: 'Not configured' });

  const payload = parseBody(event);
  if (!payload) return json(event, 400, { error: 'Invalid JSON' });

  // С одного адреса: 8 заявок за 10 минут. Всего: 80 в час (защита от спама в чат).
  if (await tooMany(event, 'tg-lead', [
    { by: 'ip', limit: 8, windowSec: 600 },
    { by: 'all', limit: 80, windowSec: 3600 }
  ])) {
    return json(event, 429, { error: 'Слишком много запросов. Попробуйте позже.' });
  }

  // Все поля — одной строкой и ограниченной длины: в сообщение нельзя подставить
  // переносы и «нарисовать» поддельное уведомление (например, об оплате).
  const form = clean(payload.form, 40);
  const name = clean(payload.name, 100);
  const contact = clean(payload.email || payload.contact, 254);
  const path = clean(payload.path || payload.source, 100);
  const notes = clean(payload.notes, 300);
  const results = payload.results
    ? clean(typeof payload.results === 'string' ? payload.results : JSON.stringify(payload.results), 600)
    : '';

  if (!contact && !name) return json(event, 400, { error: 'Пустая заявка' });

  const fields = [
    name && `<b>Имя:</b> ${escapeHtml(name)}`,
    contact && `<b>Контакт:</b> ${escapeHtml(contact)}`,
    path && `<b>Откуда:</b> ${escapeHtml(path)}`,
    notes && `<b>Заметка:</b> ${escapeHtml(notes)}`,
    results && `<b>Результаты теста:</b> <code>${escapeHtml(results)}</code>`
  ].filter(Boolean);

  // Подсказка, что делать с заявкой: владелец не должен гадать, можно ли ответить через бота
  const isTest = /тест метапрограмм|metaprograms/i.test(form);
  const hint = isTest
    ? 'Что делать: ничего. Человек прошёл бесплатный тест, письмо с результатами отправляется ему автоматически. Контакт сохранён в CRM.'
    : 'Что делать: связаться с человеком по контакту выше. Через бота ответить нельзя, заявка оставлена на сайте. Она уже в CRM: strengthsacademy.ru/admin';

  const lines = [
    `🔔 <b>Заявка с сайта${form ? `: ${escapeHtml(form)}` : ''}</b>`,
    ``,
    ...fields,
    ``,
    `<i>${hint}</i>`,
    `<i>${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} МСК</i>`
  ].join('\n');

  // Если оставлен телефон: кнопки, чтобы сразу открыть переписку с этим номером
  const digits = contact.includes('@') ? '' : contact.replace(/\D/g, '');
  const phone = digits.length === 11 && /^[78]/.test(digits) ? '7' + digits.slice(1) : digits.length === 10 ? '7' + digits : digits.length >= 11 && digits.length <= 15 ? digits : '';
  const buttons = phone
    ? { inline_keyboard: [[{ text: 'Написать в Telegram', url: `https://t.me/+${phone}` }, { text: 'Написать в WhatsApp', url: `https://wa.me/${phone}` }]] }
    : null;

  const post = (withButtons) => fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TG_CHAT_ID,
      text: lines,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...(withButtons ? { reply_markup: buttons } : {})
    })
  }).then((r) => r.json());

  try {
    let data = await post(Boolean(buttons));
    // Кнопки не должны стоить заявки: если Telegram их не принял, шлём без них
    if (!data.ok && buttons) data = await post(false);
    if (!data.ok) {
      console.error('Telegram API error:', JSON.stringify(data));
      return json(event, 502, { error: 'Не удалось отправить' });
    }
    return json(event, 200, { ok: true });
  } catch (e) {
    console.error('tg-lead failed:', e.message);
    return json(event, 500, { error: 'Не удалось отправить' });
  }
};
