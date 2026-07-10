// Telegram webhook — receives updates from bot, auto-replies to /start,
// forwards user messages to Maria's chat.
// Register with: https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<site>/.netlify/functions/tg-webhook

export const handler = async (event) => {
  const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
  const TG_CHAT_ID = process.env.TG_CHAT_ID;

  if (!TG_BOT_TOKEN || !TG_CHAT_ID) {
    return { statusCode: 500, body: 'Not configured' };
  }

  let update;
  try {
    update = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 200, body: 'ok' };
  }

  const msg = update.message;
  if (!msg) return { statusCode: 200, body: 'ok' };

  const send = (chatId, text) =>
    fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true })
    }).catch(() => {});

  const userName = [msg.from.first_name, msg.from.last_name].filter(Boolean).join(' ');
  const username = msg.from.username ? `@${msg.from.username}` : '—';
  const isFromOwner = String(msg.chat.id) === String(TG_CHAT_ID);

  if (msg.text?.startsWith('/start')) {
    const source = msg.text.split(' ')[1] || 'direct';
    await send(msg.chat.id,
      `Здравствуйте! 👋\n\n` +
      `Вы в чате со <b>Strengths Academy</b>. Оставьте ваш вопрос — эксперт-коуч ответит в течение рабочего дня.\n\n` +
      `<i>Пока можно посмотреть наши программы: strengthsacademy.ru</i>`
    );
    if (!isFromOwner) {
      await send(TG_CHAT_ID,
        `🔔 <b>Новый чат из бота</b>\n\n` +
        `Имя: <b>${escapeHtml(userName)}</b>\n` +
        `Username: ${escapeHtml(username)}\n` +
        `Источник: <code>${escapeHtml(source)}</code>\n` +
        `Chat ID: <code>${msg.chat.id}</code>`
      );
    }
    return { statusCode: 200, body: 'ok' };
  }

  if (!isFromOwner && msg.text) {
    await send(TG_CHAT_ID,
      `💬 <b>${escapeHtml(userName)}</b> ${escapeHtml(username)}:\n\n` +
      `${escapeHtml(msg.text)}\n\n` +
      `<i>Чтобы ответить — сделайте свайп-ответ (reply) на это сообщение и напишите текст. Или командой: /reply_${msg.chat.id} текст</i>`
    );
    return { statusCode: 200, body: 'ok' };
  }

  // ===== Ответы владельца клиентам =====
  if (isFromOwner && msg.text) {
    let targetChatId = null;
    let replyText = null;

    // Способ 1: свайп-ответ на пересланное ботом сообщение — берём chat id из его текста
    if (msg.reply_to_message?.text) {
      const m = msg.reply_to_message.text.match(/\/reply_(\d+)|Chat ID: (\d+)/);
      if (m) {
        targetChatId = m[1] || m[2];
        replyText = msg.text;
      }
    }

    // Способ 2: команда /reply_123456789 текст ответа
    if (!targetChatId) {
      const m = msg.text.match(/^\/reply_(\d+)\s+([\s\S]+)/);
      if (m) {
        targetChatId = m[1];
        replyText = m[2];
      }
    }

    if (targetChatId && replyText) {
      const resp = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: targetChatId, text: replyText, disable_web_page_preview: true })
      }).then(r => r.json()).catch(() => ({ ok: false }));

      await send(TG_CHAT_ID, resp.ok
        ? `✅ Доставлено клиенту (chat ${targetChatId})`
        : `⚠️ Не удалось доставить (chat ${targetChatId}). Возможно, клиент заблокировал бота.`);
      return { statusCode: 200, body: 'ok' };
    }
  }

  return { statusCode: 200, body: 'ok' };
};

function escapeHtml(s) {
  return String(s || '').replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
}
