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
    `<b>Форма:</b> ${escapeHtml(form || 'unknown')}`,
    name && `<b>Имя:</b> ${escapeHtml(name)}`,
    contact && `<b>Контакт:</b> ${escapeHtml(contact)}`,
    path && `<b>Раздел:</b> ${escapeHtml(path)}`,
    notes && `<b>Заметка:</b> ${escapeHtml(notes)}`,
    results && `<b>Результаты теста:</b> <code>${escapeHtml(results)}</code>`
  ].filter(Boolean);

  const lines = [
    `🔔 <b>Новая заявка с сайта</b>`,
    ``,
    ...fields,
    ``,
    `<i>${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} МСК</i>`
  ].join('\n');

  try {
    const resp = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: lines,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
    const data = await resp.json();
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
