// Netlify Function — forwards form submissions to Telegram bot
// Requires env vars in Netlify: TG_BOT_TOKEN, TG_CHAT_ID

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };
  }

  const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
  const TG_CHAT_ID = process.env.TG_CHAT_ID;

  if (!TG_BOT_TOKEN || !TG_CHAT_ID) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'Bot not configured — missing TG_BOT_TOKEN or TG_CHAT_ID' })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: CORS, body: 'Invalid JSON' };
  }

  const { form, name, contact, email, results, path } = payload;

  const lines = [
    `🔔 <b>Новая заявка с сайта</b>`,
    ``,
    `<b>Форма:</b> ${form || 'unknown'}`,
    name && `<b>Имя:</b> ${escapeHtml(name)}`,
    (email || contact) && `<b>Контакт:</b> ${escapeHtml(email || contact)}`,
    path && `<b>Раздел:</b> ${escapeHtml(path)}`,
    results && `<b>Результаты теста:</b> <code>${escapeHtml(typeof results === 'string' ? results : JSON.stringify(results))}</code>`,
    ``,
    `<i>${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} МСК</i>`
  ].filter(Boolean).join('\n');

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
      return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'Telegram API error', details: data }) };
    }
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: e.message }) };
  }
};

function escapeHtml(s) {
  return String(s).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
}
