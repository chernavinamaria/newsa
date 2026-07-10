// Sends the metaprograms test report to the user via Resend.
// Env vars: RESEND_API_KEY, FROM_EMAIL (default: hello@strengthsacademy.ru)

const RESULT_META = {
  toward: {
    title: 'К цели',
    color: '#0a9396',
    description: 'Вы двигаетесь к желаемому. Вы знаете, чего хотите, и создаёте свою собственную мотивацию из результата. Постановка цели и вознаграждение придают вам силы.',
    extended: 'В работе: чётко формулируете задачи, легко зажигаетесь новыми проектами, ставите амбициозные цели и достигаете их. В общении: говорите о том, чего хотите достичь. Опасность: можете не замечать существующих угроз и рисков, пропускать сигналы «стоп» от команды и организма. Совет: раз в неделю сознательно спрашивайте себя «А от чего я хочу уйти?» — это добавит объёмности решениям.'
  },
  away: {
    title: 'От проблемы',
    color: '#fff1ad',
    description: 'Вам легче установить, чего вы НЕ хотите. Вы в первую очередь замечаете проблемы, риски, «подводные камни». Мотивация — избежать неприятностей или страх наказания.',
    extended: 'В работе: критическое мышление, ранняя диагностика рисков, вы «страховщик» команды. Часто на вас держится «а вы подумали, что если…». В общении: часто используете сослагательное наклонение — «если бы, тогда бы». Опасность: сложно ставить позитивные цели, легко перегореть на постоянном сканировании угроз. Совет: тренируйте формулировку «чего я хочу» вместо «чего я боюсь» — это разгружает нервную систему.'
  },
  similarities: {
    title: 'Сходства',
    color: '#0a9396',
    description: 'Вы познаёте новое, увязывая новую информацию с той, что уже известна. Легко устанавливаете взаимосвязи, подмечаете аналогии. Ваш подход к жизни — «синтез».',
    extended: 'В работе: сильны в анализе повторяющихся паттернов, построении устойчивых процессов, наставничестве. Хороши в ролях, где важна преемственность знаний. Опасность: не любите перемен, избегаете новых технологий и революционных решений. При частых сменах контекста быстро устаёте. Совет: осознанно раз в месяц пробуйте что-то принципиально новое — от еды до методологии — это тренирует гибкость.'
  },
  differences: {
    title: 'Различия',
    color: '#fff1ad',
    description: 'В познании вы сфокусированы на различиях. Фильтруете действительность, вычленяя всё новое, любые отклонения и отличия. Хотите изменений, вас привлекают сложные задачи.',
    extended: 'В работе: креативны, инновационны, легко переизобретаете процессы, находите неочевидные решения. Незаменимы в командах, которые запускают новое. Опасность: рутинная работа тяготит, вы можете «раскачивать лодку», когда команде нужна стабильность. Совет: договоритесь с командой о зоне вашей инновационности и зоне обычных задач — это снизит трение.'
  },
  internal: {
    title: 'Внутренняя референция',
    color: '#0a9396',
    description: 'При принятии решений вы полагаетесь на собственное суждение. Сами формулируете мотивационные стимулы и самостоятельно оцениваете свои действия. Идёте за своим внутренним компасом.',
    extended: 'В работе: устойчивы к внешнему давлению, принимаете сложные решения, отстаиваете позицию. Хороши в ролях, где нужна независимость мышления — эксперт, лидер, консультант. Опасность: трудно сработаться с директивным руководителем, склонны отвергать чужое мнение до его серьёзного рассмотрения. Совет: перед важным решением сознательно запрашивайте 1-2 внешних мнения — не для того чтобы им следовать, а чтобы проверить свою рамку.'
  },
  external: {
    title: 'Внешняя референция',
    color: '#fff1ad',
    description: 'При принятии решений вам нужна поддержка окружающих и обратная связь. Вы придерживаетесь мнения авторитетов, получаете мотивацию извне, нуждаетесь в указаниях.',
    extended: 'В работе: хорошо работаете в структурированных командах с чёткой обратной связью, сильны в клиентском сервисе — тонко чувствуете, что нужно другому. Развиваетесь быстрее в наставничестве. Опасность: без внешней поддержки быстро теряете направление, легко «раствориться» в чужих ожиданиях. Совет: заведите одного-двух наставников/менторов, чью обратную связь вы будете системно получать — это внешний скелет для роста.'
  },
  procedures: {
    title: 'Процедуры',
    color: '#0a9396',
    description: 'Вы предпочитаете действовать по заданному алгоритму, чтобы избежать необходимости делать самостоятельный выбор. Комфортно, когда задачи определены и указан каждый этап.',
    extended: 'В работе: превосходно выполняете задачи по чёткой схеме, обеспечиваете качество исполнения, надёжны в операционных ролях. Незаменимы там, где важна точность и повторяемость. Опасность: испытываете затруднения при работе, требующей творческого подхода и самостоятельного принятия решений. Совет: постепенно берите одну «свободную» задачу в неделю без готовой инструкции — это тренирует адаптивность.'
  },
  options: {
    title: 'Варианты',
    color: '#fff1ad',
    description: 'Вы предпочитаете иметь возможность выбора. Избегаете общепринятых схем. Комфортно, когда есть возможность влиять на процесс достижения цели. Креативны.',
    extended: 'В работе: генератор альтернатив, находите обходные пути, изобретательны. Хороши в стартапах, творческих ролях, антикризисных ситуациях. Опасность: испытываете затруднения при работе, требующей строгого следования инструкции — процедуры вас душат. Совет: договаривайтесь с руководителем о «результате», а не о «способе» — это снимает трение.'
  }
};

const PAIR_TITLES = {
  motivation: 'Направление мотивации',
  relations: 'Взаимосвязи',
  reference: 'Референция',
  focus: 'Центр внимания'
};

function buildHtml(name, results) {
  const rows = results.map(r => {
    const res = RESULT_META[r.pole];
    if (!res) return '';
    return `
      <tr>
        <td style="padding:0 0 16px 0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse; background:#f5f7f8; border-radius:16px;">
            <tr>
              <td style="padding:24px;">
                <div style="font-size:11px; font-weight:900; letter-spacing:2px; text-transform:uppercase; color:#004452; opacity:0.6; margin-bottom:6px;">
                  ${PAIR_TITLES[r.pair]}${r.strength ? ' · ' + r.strength + '% выражено' : ''}
                </div>
                <div style="font-size:22px; font-weight:900; font-style:italic; text-transform:uppercase; letter-spacing:-0.5px; color:${res.color === '#fff1ad' ? '#004452' : res.color}; margin-bottom:10px;">
                  ${res.title}
                </div>
                <div style="font-size:15px; line-height:1.7; color:#374151;">
                  ${res.description}
                </div>
                ${res.extended ? `<div style="font-size:14px; line-height:1.7; color:#6b7280; margin-top:12px; padding-top:12px; border-top:1px solid #e5e7eb;">${res.extended}</div>` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
  }).join('');

  const safeName = String(name || '').trim();
  const greeting = safeName ? `Здравствуйте, <b>${escapeHtml(safeName)}</b>!` : 'Здравствуйте!';

  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ваш профиль метапрограмм</title>
</head>
<body style="margin:0; padding:0; background:#f5f7f8; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#004452;">
  <div style="display:none; max-height:0; overflow:hidden;">
    Разбор вашего профиля по 4 метапрограммам и рекомендации от коуча Strengths Academy.
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7f8; padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 2px 24px rgba(0,68,82,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#004452; padding:32px 32px 28px 32px; text-align:center;">
              <div style="display:inline-block; width:44px; height:44px; line-height:44px; background:#fff1ad; color:#004452; border-radius:12px; font-weight:900; font-style:italic; font-size:18px; margin-bottom:16px;">SA</div>
              <div style="font-size:13px; font-weight:900; letter-spacing:2px; text-transform:uppercase; color:#AECD65; margin-bottom:8px;">Ваш профиль</div>
              <div style="font-size:26px; font-weight:900; font-style:italic; text-transform:uppercase; letter-spacing:-1px; color:#ffffff; line-height:1.1;">
                Разбор <span style="color:#fff1ad;">метапрограмм</span>
              </div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:32px 32px 8px 32px;">
              <p style="margin:0 0 16px 0; font-size:16px; color:#004452; line-height:1.6;">
                ${greeting}
              </p>
              <p style="margin:0 0 16px 0; font-size:15px; color:#374151; line-height:1.7;">
                Вы прошли тест «Метапрограммы» на нашем сайте. Ниже — ваш персональный разбор по 4 ключевым настройкам мышления с подробным пояснением, как они влияют на вашу жизнь и работу.
              </p>
              <p style="margin:0 0 24px 0; font-size:14px; color:#6b7280; line-height:1.7; padding:14px 16px; background:#f5f7f8; border-radius:12px; border-left:3px solid #AECD65;">
                <b style="color:#004452;">Метапрограммы</b> — это привычки мышления. Они определяют, как вы фильтруете информацию, что замечаете первым, откуда берёте мотивацию и как принимаете решения. Понимание своих метапрограмм — первый шаг к тому, чтобы перестать «бороться с собой» и начать использовать свою настройку осознанно.
              </p>
            </td>
          </tr>

          <!-- Results -->
          <tr>
            <td style="padding:0 32px 8px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                ${rows}
              </table>
            </td>
          </tr>

          <!-- Bridge to CliftonStrengths -->
          <tr>
            <td style="padding:16px 32px 24px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#004452; border-radius:24px; overflow:hidden;">
                <tr>
                  <td style="padding:32px; color:#ffffff;">
                    <div style="font-size:11px; font-weight:900; letter-spacing:3px; text-transform:uppercase; color:#fff1ad; margin-bottom:12px;">
                      Что дальше
                    </div>
                    <div style="font-size:22px; font-weight:900; font-style:italic; text-transform:uppercase; letter-spacing:-0.5px; line-height:1.2; margin-bottom:16px;">
                      Метапрограммы — только половина формулы
                    </div>
                    <p style="margin:0 0 16px 0; font-size:15px; line-height:1.7; color:rgba(255,255,255,0.9);">
                      Метапрограммы показывают, <b style="color:#fff1ad;">КАК</b> вы принимаете решения. Но чтобы понять, <b style="color:#fff1ad;">В ЧЁМ</b> вы естественно сильны, нужен второй слой — ваши <b>34 таланта по Gallup CliftonStrengths</b>.
                    </p>
                    <p style="margin:0 0 20px 0; font-size:15px; line-height:1.7; color:rgba(255,255,255,0.9);">
                      Один и тот же талант работает по-разному у человека с мотивацией «к цели» и «от проблемы». У «внутренней референции» и «внешней». Когда вы знаете оба слоя — метапрограммы + таланты — вы начинаете принимать решения из своей силы, а не из чужих сценариев. Ставите цели, которые действительно ваши. Собираете команду, которая дополняет, а не бесит.
                    </p>

                    <!-- CTA 1: Test purchase (entry point) -->
                    <div style="background:rgba(255,255,255,0.06); border-radius:16px; padding:20px; margin-bottom:16px;">
                      <div style="font-size:11px; font-weight:900; letter-spacing:2px; text-transform:uppercase; color:#AECD65; margin-bottom:6px;">Шаг 1 · 10 000 ₽</div>
                      <div style="font-size:17px; font-weight:900; font-style:italic; color:#ffffff; margin-bottom:10px;">Пройти тест CliftonStrengths</div>
                      <p style="margin:0 0 12px 0; font-size:14px; line-height:1.6; color:rgba(255,255,255,0.85);">
                        Официальный тест Gallup: 177 вопросов, ~45 минут. Получите полный отчёт по 34 талантам с выделенным топ-5 в PDF. Это ваша база — от неё дальше строится вся работа.
                      </p>
                      <p style="margin:0 0 14px 0; font-size:12px; line-height:1.6; color:rgba(255,255,255,0.55);">
                        Как это работает: оплачиваете картой прямо на сайте → в течение 24 часов присылаем коды доступа на платформу Gallup → проходите тест → отчёт на email.
                      </p>
                      <a href="https://www.strengthsacademy.ru/#products" style="display:block; padding:16px 24px; background:#AECD65; color:#004452; text-decoration:none; border-radius:14px; font-weight:900; font-size:13px; letter-spacing:2px; text-transform:uppercase; text-align:center;">
                        Пройти тест Gallup
                      </a>
                    </div>

                    <!-- CTA 2: Coach meeting -->
                    <div style="background:rgba(255,255,255,0.06); border-radius:16px; padding:20px;">
                      <div style="font-size:11px; font-weight:900; letter-spacing:2px; text-transform:uppercase; color:#fff1ad; margin-bottom:6px;">Шаг 2 · 50 000 ₽</div>
                      <div style="font-size:17px; font-weight:900; font-style:italic; color:#ffffff; margin-bottom:10px;">Встреча с коучем — 1,5 часа</div>
                      <p style="margin:0 0 10px 0; font-size:14px; line-height:1.6; color:rgba(255,255,255,0.85);">
                        Живой разбор ваших 5 главных талантов Gallup применительно к вашим текущим задачам и метапрограммам. Это не про «что такое Focus» — это про то, как ваш Focus работает с вашей мотивацией «к цели» именно у вас.
                      </p>
                      <p style="margin:0 0 6px 0; font-size:13px; line-height:1.6; color:rgba(255,255,255,0.9);">Что получите:</p>
                      <ul style="margin:0 0 14px 0; padding-left:20px; font-size:13px; line-height:1.7; color:rgba(255,255,255,0.8);">
                        <li>Персональный action plan на 30/60/90 дней</li>
                        <li>Разбор ваших «граблей» — где таланты работают против вас</li>
                        <li>Ответы на конкретные вопросы (карьера, команда, роль)</li>
                        <li>3 месяца поддержки в Telegram</li>
                      </ul>
                      <a href="https://www.strengthsacademy.ru/#cta" style="display:block; padding:16px 24px; background:#fff1ad; color:#004452; text-decoration:none; border-radius:14px; font-weight:900; font-size:13px; letter-spacing:2px; text-transform:uppercase; text-align:center;">
                        Записаться на встречу
                      </a>
                      <p style="margin:10px 0 0 0; font-size:11px; text-align:center; color:rgba(255,255,255,0.5); font-weight:700; letter-spacing:1px;">
                        Оставьте заявку — мы свяжемся в течение рабочего дня и подберём дату
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 32px 32px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #e5e7eb;">
                <tr>
                  <td style="padding-top:24px;">
                    <p style="margin:0 0 10px 0; font-size:13px; color:#004452; font-weight:700;">Strengths Academy</p>
                    <p style="margin:0 0 6px 0; font-size:12px; color:#6b7280; line-height:1.6;">
                      Россия: <a href="tel:+79264492409" style="color:#0a9396; text-decoration:none;">+7 926 449-24-09</a><br>
                      Европа: <a href="tel:+31653322331" style="color:#0a9396; text-decoration:none;">+31 6 5332-2331</a>
                    </p>
                    <p style="margin:0 0 6px 0; font-size:12px; color:#6b7280;">
                      <a href="mailto:strengthsacademy.ru@gmail.com" style="color:#0a9396; text-decoration:none;">strengthsacademy.ru@gmail.com</a>
                    </p>
                    <p style="margin:0 0 6px 0; font-size:12px; color:#6b7280;">
                      Telegram: <a href="https://t.me/strengths_academy" style="color:#0a9396; text-decoration:none;">@strengths_academy</a> · Сайт: <a href="https://strengthsacademy.ru" style="color:#0a9396; text-decoration:none;">strengthsacademy.ru</a>
                    </p>
                    <p style="margin:16px 0 0 0; font-size:11px; color:#9ca3af; line-height:1.5;">
                      Вы получили это письмо, так как самостоятельно прошли тест на нашем сайте и оставили email для расширенного отчёта.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s || '').replace(/[<>&"']/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&#39;' }[c]));
}

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
    return { statusCode: 405, headers: CORS, body: 'Method not allowed' };
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'Strengths Academy <hello@strengthsacademy.ru>';

  if (!RESEND_API_KEY) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'RESEND_API_KEY not configured' }) };
  }

  let payload;
  try { payload = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers: CORS, body: 'Invalid JSON' }; }

  const { name, email, results } = payload;
  if (!email || !results) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'email and results required' }) };
  }

  const html = buildHtml(name, results);
  const subject = 'Ваш профиль метапрограмм · Strengths Academy';

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject,
        html,
        reply_to: 'strengthsacademy.ru@gmail.com'
      })
    });
    const data = await resp.json();
    if (!resp.ok) {
      return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'Resend error', details: data }) };
    }
    return { statusCode: 200, headers: { ...CORS, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true, id: data.id }) };
  } catch (e) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: e.message }) };
  }
};
