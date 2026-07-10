// Netlify Function — отправка кодов доступа Gallup клиенту (кнопка в админке)
// Защита: пароль админки проверяется через CRM (admin_verify) — единый источник истины.
// Env vars: RESEND_API_KEY, FROM_EMAIL

const CRM_URL = 'https://script.google.com/macros/s/AKfycbxEZl8aNXzVz1GYI06UN4zJvw2Z2hcedpHAmQog1sqc47LgrshJnrVFaUcX5O0YPHaM/exec';

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

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'Strengths Academy <hello@strengthsacademy.ru>';
  if (!RESEND_API_KEY) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Not configured' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: CORS, body: 'Invalid JSON' };
  }

  const { password, email, name, codes, deadline } = payload;

  // Авторизация: только тот, кто знает пароль админки
  try {
    const verify = await fetch(`${CRM_URL}?action=admin_verify&password=${encodeURIComponent(password || '')}`, { redirect: 'follow' }).then(r => r.json());
    if (!verify.success) {
      return { statusCode: 403, headers: CORS, body: JSON.stringify({ error: 'Неверный пароль админки' }) };
    }
  } catch {
    return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'CRM недоступна для проверки пароля' }) };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Некорректный email' }) };
  }
  const codeList = String(codes || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean).slice(0, 10);
  if (codeList.length === 0) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Не указан ни один код' }) };
  }

  const html = buildCodesHtml(name, codeList, deadline);

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: 'Ваши коды доступа к тесту Gallup CliftonStrengths',
        html,
        reply_to: 'strengthsacademy.ru@gmail.com'
      })
    });
    const data = await resp.json();
    if (!resp.ok) {
      return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'Resend error', details: data }) };
    }
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, id: data.id, sent: codeList.length }) };
  } catch (e) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: e.message }) };
  }
};

function buildCodesHtml(name, codeList, deadline) {
  const safeName = escapeHtml(String(name || '').trim());
  const greeting = safeName ? `Добрый день, <b>${safeName}</b>!` : 'Добрый день!';
  const codesBlock = codeList.map(c => `
    <div style="background:#004452; color:#fff1ad; font-family:'Courier New',monospace; font-size:20px; font-weight:bold; letter-spacing:2px; text-align:center; padding:18px 16px; border-radius:14px; margin-bottom:10px;">
      ${escapeHtml(c)}
    </div>`).join('');
  const deadlineBlock = deadline ? `
            <div style="background:#fff1ad; border-radius:14px; padding:14px 20px; margin:0 0 20px 0; text-align:center;">
              <span style="font-size:14px; font-weight:900; color:#004452;">⏰ Просим пройти тестирование до ${escapeHtml(String(deadline))}</span>
            </div>` : '';

  const stepTitle = (n, t) => `
              <div style="margin:0 0 10px 0;">
                <span style="display:inline-block; width:28px; height:28px; line-height:28px; background:#004452; color:#fff1ad; border-radius:8px; text-align:center; font-weight:900; font-size:14px; margin-right:10px;">${n}</span>
                <span style="font-size:14px; font-weight:900; letter-spacing:1px; text-transform:uppercase; color:#004452;">${t}</span>
              </div>`;

  return `<!doctype html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Коды доступа Gallup</title></head>
<body style="margin:0; padding:0; background:#f5f7f8; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#004452;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7f8; padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 2px 24px rgba(0,68,82,0.08);">

        <tr>
          <td style="background:#004452; padding:32px; text-align:center;">
            <div style="display:inline-block; width:44px; height:44px; line-height:44px; background:#fff1ad; color:#004452; border-radius:12px; font-weight:900; font-style:italic; font-size:18px; margin-bottom:16px;">SA</div>
            <div style="font-size:13px; font-weight:900; letter-spacing:2px; text-transform:uppercase; color:#AECD65; margin-bottom:8px;">Всё готово</div>
            <div style="font-size:26px; font-weight:900; font-style:italic; text-transform:uppercase; letter-spacing:-1px; color:#ffffff; line-height:1.1;">
              Ваш доступ к тесту <span style="color:#fff1ad;">Gallup</span>
            </div>
          </td>
        </tr>

        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px 0; font-size:16px; line-height:1.6;">${greeting}</p>
            <p style="margin:0 0 20px 0; font-size:15px; color:#374151; line-height:1.7;">
              Приглашаем вас пройти тестирование <b>CliftonStrengths от Gallup</b> — онлайн-инструмент, который помогает определить, понять и максимально использовать свои сильные стороны. ${codeList.length > 1 ? 'Ваши коды доступа' : 'Ваш код доступа'}:
            </p>
            ${codesBlock}
            ${deadlineBlock}

            <div style="background:#f5f7f8; border-radius:16px; padding:20px 24px; margin:0 0 14px 0;">
              ${stepTitle(1, 'Подготовка и регистрация')}
              <ul style="margin:0; padding-left:20px; font-size:14px; line-height:1.9; color:#374151;">
                <li>Выделите <b>45 минут</b>, чтобы пройти тест за один раз, в спокойной обстановке и без перерывов</li>
                <li>Лучше проходить <b>с компьютера или ноутбука</b></li>
                <li>⚠️ <b>Включите VPN</b> на устройстве — без него сайт Gallup из России может не открыться</li>
                <li>Зайдите на <a href="https://www.gallup.com/access" style="color:#0a9396; font-weight:bold;">gallup.com/access</a> (Gallup Access)</li>
                <li>Нажмите <b>Sign in</b> (справа вверху) и зарегистрируйте новую учётную запись. Страна — <b>Россия</b>, язык прохождения — <b>русский</b></li>
              </ul>
            </div>

            <div style="background:#f5f7f8; border-radius:16px; padding:20px 24px; margin:0 0 14px 0;">
              ${stepTitle(2, 'Активация кода и прохождение теста')}
              <ul style="margin:0; padding-left:20px; font-size:14px; line-height:1.9; color:#374151;">
                <li>В верхнем левом углу откройте <b>Меню</b> (три горизонтальные чёрточки)</li>
                <li>Нажмите <b>«Активировать код доступа»</b> (Redeem Access Code)</li>
                <li>Скопируйте код из этого письма, вставьте и нажмите <b>«Продолжить»</b></li>
                <li>Пройдите тест: 177 вопросов, на каждый даётся 20 секунд — отвечайте первое, что приходит в голову, тест меряет естественные реакции</li>
              </ul>
            </div>

            <div style="background:#f5f7f8; border-radius:16px; padding:20px 24px; margin:0 0 20px 0;">
              ${stepTitle(3, 'Ваш отчёт')}
              <ul style="margin:0; padding-left:20px; font-size:14px; line-height:1.9; color:#374151;">
                <li>Через ~10 минут после завершения отчёт появится в личном кабинете Gallup</li>
                <li>Его можно скачать на компьютер (PDF) — он понадобится для работы с коучем</li>
              </ul>
            </div>

            <p style="margin:0; font-size:14px; color:#374151; line-height:1.7;">
              Если возникнут проблемы или потребуется помощь — просто ответьте на это письмо, напишите на <a href="mailto:strengthsacademy.ru@gmail.com" style="color:#0a9396; font-weight:bold;">strengthsacademy.ru@gmail.com</a> или в Telegram: <a href="https://t.me/strengthsacademy_bot" style="color:#0a9396; font-weight:bold;">@strengthsacademy_bot</a>
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
</html>`;
}

function escapeHtml(s) {
  return String(s || '').replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c]));
}
