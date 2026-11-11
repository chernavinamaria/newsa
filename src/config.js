export const CRM_URL = 'https://script.google.com/macros/s/AKfycbzE4LCgMdmofkH4OxFyn56f5AJvaw7kCohL3pLi-beOdTq29gmBSBcaW7CXQw8Pncep/exec';
export const BACKEND_URL = 'https://sa-api-backend.netlify.app/.netlify/functions';

// Онлайн-оплата: false = вместо формы оплаты показывается заглушка
// «свяжитесь с нами». Включить в true после подключения БОЕВОГО терминала
// T-Business (см. CLAUDE.md, секция T-Business).
export const PAYMENTS_ENABLED = true;

// Ссылки на оплату тарифов программы «Сильные стороны: от таланта к мастерству».
// Пока пустые — кнопки на /program собирают заявку в CRM и бота.
// Как появятся страницы оплаты в GetCourse — вставить сюда, кнопки сами станут «Оплатить».
export const PROGRAM_CHECKOUT = {
  observer: '',     // «Наблюдатель», 4 500 ₽
  researcher: '',   // «Исследователь», 19 500 ₽
  architect: ''     // «Архитектор», 49 000 ₽
};

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
