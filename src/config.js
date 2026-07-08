export const CRM_URL = 'https://script.google.com/macros/s/AKfycbxEZl8aNXzVz1GYI06UN4zJvw2Z2hcedpHAmQog1sqc47LgrshJnrVFaUcX5O0YPHaM/exec';
export const BACKEND_URL = 'https://sa-api-backend.netlify.app/.netlify/functions';

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
