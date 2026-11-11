// Netlify Function — отправка кодов доступа Gallup клиенту (кнопка в админке)
// Защита: пароль админки проверяется через CRM (admin_verify) — единый источник истины.
// Env vars: RESEND_API_KEY, FROM_EMAIL

import { precheck, parseBody, json, clean, isEmail, tooMany } from '../lib/guard.js';

const CRM_URL = 'https://script.google.com/macros/s/AKfycbzE4LCgMdmofkH4OxFyn56f5AJvaw7kCohL3pLi-beOdTq29gmBSBcaW7CXQw8Pncep/exec';

// Неверные пароли считаем: 10 ошибок с одного адреса за 15 минут или 40 со всех адресов,
// после этого функция перестаёт проверять пароль до конца окна (защита от подбора).
const FAIL_RULES = [
  { by: 'ip', limit: 10, windowSec: 900 },
  { by: 'all', limit: 40, windowSec: 900 }
];

export const handler = async (event) => {
  const rejected = precheck(event);
  if (rejected) return rejected;

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'Strengths Academy <hello@strengthsacademy.ru>';
  if (!RESEND_API_KEY) return json(event, 500, { error: 'Not configured' });

  const payload = parseBody(event);
  if (!payload) return json(event, 400, { error: 'Invalid JSON' });

  const password = typeof payload.password === 'string' ? payload.password.slice(0, 200) : '';
  const email = clean(payload.email, 254);
  const name = clean(payload.name, 100);
  const deadline = clean(payload.deadline, 60);

  if (!password) return json(event, 403, { error: 'Неверный пароль админки' });
  if (await tooMany(event, 'send-codes-fail', FAIL_RULES, { count: false })) {
    return json(event, 429, { error: 'Слишком много неверных попыток. Подождите 15 минут.' });
  }

  // Авторизация: только тот, кто знает пароль админки. Пароль уходит в CRM в теле POST,
  // а не в адресной строке, чтобы не оставаться в журналах.
  try {
    const verify = await fetch(CRM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ type: 'admin_verify', password }),
      redirect: 'follow'
    }).then((r) => r.json());
    if (!verify.success) {
      await tooMany(event, 'send-codes-fail', FAIL_RULES);
      return json(event, 403, { error: verify.locked ? verify.error : 'Неверный пароль админки' });
    }
  } catch {
    return json(event, 502, { error: 'CRM недоступна для проверки пароля' });
  }

  if (!isEmail(email)) return json(event, 400, { error: 'Некорректный email' });
  const codeList = String(payload.codes || '').split(/\r?\n/).map((c) => clean(c, 60)).filter(Boolean).slice(0, 10);
  if (codeList.length === 0) return json(event, 400, { error: 'Не указан ни один код' });

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
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.error('Resend error:', JSON.stringify(data));
      return json(event, 502, { error: 'Почтовый сервис не принял письмо. Проверьте адрес и попробуйте ещё раз.' });
    }
    return json(event, 200, { ok: true, id: data.id, sent: codeList.length });
  } catch (e) {
    console.error('send-codes failed:', e.message);
    return json(event, 500, { error: 'Не удалось отправить письмо' });
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
