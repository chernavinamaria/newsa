export const CRM_URL = 'https://script.google.com/macros/s/AKfycbywcAbQ_8lLhVDtVziA0r4v8WasU42WI2Cfx3K-th7xqvyJ3aSWELbXggNSfZ5pXlIz/exec';
export const BACKEND_URL = 'https://sa-api-backend.netlify.app/.netlify/functions';

// Онлайн-оплата: false = вместо формы оплаты показывается заглушка
// «свяжитесь с нами». Включить в true после подключения БОЕВОГО терминала
// T-Business (см. CLAUDE.md, секция T-Business).
export const PAYMENTS_ENABLED = false;

// Простая функция для отправки заявки: параллельно в Google Sheet + Telegram
export async function submitLead(payload) {
  const promises = [];
  // 1. Google Sheet CRM
  promises.push(
    fetch(CRM_URL, {
      method: 'POST',
      // Apps Script requires text/plain to avoid CORS preflight
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    }).catch(() => {})
  );
  // 2. Telegram уведомление (дублируем для мгновенного алерта)
  promises.push(
    fetch(`${BACKEND_URL}/tg-lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ form: payload.type, ...payload })
    }).catch(() => {})
  );
  await Promise.all(promises);
}
