// Вебхук Telegram-бота. Бот работает как общий почтовый ящик школы:
//   клиент пишет боту        -> сообщение приходит владельцу (TG_CHAT_ID)
//   владелец отвечает на него -> ответ уходит клиенту от имени бота
// Регистрация: setWebhook с secret_token = TG_WEBHOOK_SECRET и
// allowed_updates = ["message", "callback_query"] (скрипт _tmp_xlsx/set-webhook.mjs).

import { safeEqual, blobStore, clean, escapeHtml } from '../lib/guard.js';

const OK = { statusCode: 200, body: 'ok' };

const HELP = [
  '<b>Как пользоваться ботом</b>',
  '',
  'Сюда приходят сообщения трёх видов.',
  '',
  '💬 <b>Сообщение от человека</b>',
  'Кто-то написал боту в Telegram. Чтобы ответить, смахните его сообщение влево (на компьютере: правая кнопка мыши, «Ответить») и напишите ответ. Можно отправить текст, фото, файл или голосовое. Человек получит ответ от имени Strengths Academy, ваш личный аккаунт он не увидит.',
  '',
  '🔔 <b>Заявка с сайта</b>',
  'Человек оставил почту или телефон в форме на сайте. Через бота ему ответить нельзя: напишите или позвоните по контакту из заявки. Все заявки хранятся в CRM: strengthsacademy.ru/admin',
  '',
  '💳 <b>Оплата</b>',
  'Клиент оплатил на сайте. Что делать дальше, написано в самом сообщении.',
  '',
  '<b>Полезно знать</b>',
  '• Если написать сюда просто так, без ответа на сообщение, бот спросит, кому из недавних собеседников это отправить.',
  '• После каждого ответа бот пишет «Доставлено». Если этой строки нет, ответ не ушёл.',
  '• Метка вида #id123 в сообщении: нажмите на неё, чтобы увидеть все сообщения этого человека.',
  '• Эта подсказка всегда под рукой: команда /help.'
].join('\n');

const SOURCES = { fromsite: 'с сайта', pay: 'со страницы оплаты', direct: 'по прямой ссылке' };

function kindOf(msg) {
  if (msg.photo) return '🖼 Фото';
  if (msg.voice) return '🎤 Голосовое сообщение';
  if (msg.video_note) return '⏺ Видеосообщение';
  if (msg.video || msg.animation) return '🎬 Видео';
  if (msg.document) return '📎 Файл';
  if (msg.audio) return '🎵 Аудио';
  if (msg.sticker) return 'Стикер';
  if (msg.contact) return '👤 Контакт';
  if (msg.location) return '📍 Геопозиция';
  return 'Сообщение';
}

function ago(ts) {
  const min = Math.round((Date.now() - ts) / 60000);
  if (min < 2) return 'только что';
  if (min < 60) return `${min} мин назад`;
  if (min < 60 * 24) return `${Math.round(min / 60)} ч назад`;
  return `${Math.round(min / 1440)} дн назад`;
}

export const handler = async (event) => {
  const TOKEN = process.env.TG_BOT_TOKEN;
  const OWNER = String(process.env.TG_CHAT_ID || '');
  const SECRET = process.env.TG_WEBHOOK_SECRET;
  if (!TOKEN || !OWNER) return { statusCode: 500, body: 'Not configured' };

  // Telegram подписывает каждый запрос секретом, который задан при регистрации вебхука.
  // Без этой проверки кто угодно мог бы прислать сюда поддельное «сообщение от владельца»
  // и писать клиентам от имени школы.
  if (SECRET) {
    const got = (event.headers || {})['x-telegram-bot-api-secret-token'] || '';
    if (!safeEqual(got, SECRET)) return { statusCode: 403, body: 'Forbidden' };
  }

  let update;
  try {
    update = JSON.parse(event.body || '{}');
  } catch {
    return OK;
  }

  const tg = (method, body) =>
    fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then((r) => r.json()).catch((e) => ({ ok: false, description: e.message }));

  const say = (text, extra = {}) =>
    tg('sendMessage', { chat_id: OWNER, text, parse_mode: 'HTML', link_preview_options: { is_disabled: true }, ...extra });

  // Память бота (Netlify Blobs, хранилище sa-bot):
  //   m/<номер сообщения в чате владельца> -> { id, name } собеседника, к которому оно относится
  //   recent -> последние собеседники (для вопроса «Кому отправить?»)
  // Если хранилище недоступно, бот продолжает работать: адресат читается из метки #id в тексте.
  let store = null;
  try {
    store = blobStore(event, 'sa-bot');
  } catch (e) {
    console.error('bot store unavailable:', e.message);
  }
  const remember = async (messageId, client) => {
    if (!store || !messageId) return;
    await store.setJSON(`m/${messageId}`, { id: client.id, name: client.name }).catch((e) => console.error('bot store write:', e.message));
  };
  const getRecent = async () => {
    if (!store) return [];
    try {
      const list = await store.get('recent', { type: 'json' });
      return Array.isArray(list) ? list : [];
    } catch (e) {
      console.error('bot store read:', e.message);
      return [];
    }
  };
  const touchRecent = async (client) => {
    if (!store) return;
    const list = (await getRecent()).filter((c) => String(c.id) !== String(client.id));
    list.unshift({ ...client, ts: Date.now() });
    await store.setJSON('recent', list.slice(0, 8)).catch((e) => console.error('bot store write:', e.message));
  };

  // Кому адресован ответ владельца: сначала по памяти бота, затем по тексту сообщения
  const resolveTarget = async (reply) => {
    if (store) {
      try {
        const hit = await store.get(`m/${reply.message_id}`, { type: 'json' });
        if (hit && hit.id) return hit;
      } catch (e) {
        console.error('bot store read:', e.message);
      }
    }
    const text = reply.text || reply.caption || '';
    // Новая разметка: метка стоит в конце строки с именем. Старая: «/reply_123» в подсказке
    // под текстом клиента (берём последнее вхождение) либо «Chat ID: 123», «(chat 123)».
    const tag = text.match(/^[^\n]*· #id(\d+)[ \t]*$/m);
    const legacy = [...text.matchAll(/\/reply_(\d+)/g)].pop() || text.match(/Chat ID: (\d+)/) || text.match(/\(chat (\d+)\)/);
    const id = tag ? tag[1] : legacy ? legacy[1] : null;
    if (!id) return null;
    const known = (await getRecent()).find((c) => String(c.id) === id);
    return { id, name: known ? known.name : 'собеседник' };
  };

  // Отправка сообщения владельца клиенту (копия: подходит для текста, фото, файлов, голосовых)
  const deliver = async (target, messageId) => {
    const res = await tg('copyMessage', { chat_id: target.id, from_chat_id: OWNER, message_id: messageId });
    const name = escapeHtml(target.name);
    const text = res.ok
      ? `✅ Доставлено: <b>${name}</b> · #id${target.id}`
      : `⚠️ Не доставлено: <b>${name}</b>. Скорее всего, человек остановил бота. Свяжитесь с ним другим способом.`;
    if (!res.ok) console.error('deliver failed:', res.description);
    return { ok: res.ok, text };
  };

  try {
    // ===== Нажатие кнопки под вопросом «Кому отправить?» =====
    const cb = update && update.callback_query;
    if (cb) {
      const chatId = cb.message && cb.message.chat ? String(cb.message.chat.id) : '';
      if (String(cb.from && cb.from.id) !== OWNER || chatId !== OWNER) {
        await tg('answerCallbackQuery', { callback_query_id: cb.id });
        return OK;
      }
      const edit = (text) => tg('editMessageText', { chat_id: OWNER, message_id: cb.message.message_id, text, parse_mode: 'HTML' });
      const to = /^to:(\d+)$/.exec(cb.data || '');
      const original = cb.message.reply_to_message;
      if (!to) {
        await edit('Не отправлено.');
      } else if (!original) {
        await edit('Не нашёл исходное сообщение. Отправьте его ещё раз.');
      } else {
        const target = (await getRecent()).find((c) => String(c.id) === to[1]);
        if (!target) {
          await edit('Этого собеседника уже нет в списке недавних. Найдите его сообщение и ответьте на него.');
        } else {
          const result = await deliver(target, original.message_id);
          await edit(result.text);
          if (result.ok) {
            await Promise.all([remember(cb.message.message_id, target), remember(original.message_id, target)]);
          }
        }
      }
      await tg('answerCallbackQuery', { callback_query_id: cb.id });
      return OK;
    }

    const msg = update && update.message;
    if (!msg || !msg.chat || !msg.from) return OK;
    const text = typeof msg.text === 'string' ? msg.text : '';

    // ===== Сообщения от клиентов =====
    if (String(msg.chat.id) !== OWNER) {
      if (msg.chat.type !== 'private') return OK;
      const client = {
        id: msg.chat.id,
        name: clean([msg.from.first_name, msg.from.last_name].filter(Boolean).join(' '), 80) || 'Без имени',
        username: clean(msg.from.username, 40)
      };
      const who = `<b>${escapeHtml(client.name)}</b>${client.username ? ` · @${escapeHtml(client.username)}` : ''} · #id${client.id}`;

      if (text.startsWith('/start')) {
        await tg('sendMessage', {
          chat_id: client.id,
          parse_mode: 'HTML',
          link_preview_options: { is_disabled: true },
          text:
            'Здравствуйте! 👋\n\n' +
            'Вы в чате со <b>Strengths Academy</b>. Напишите ваш вопрос прямо здесь, мы ответим в течение рабочего дня.\n\n' +
            '<i>Пока можно посмотреть наши программы: strengthsacademy.ru</i>'
        });
        const source = clean(text.split(' ')[1], 40) || 'direct';
        const sent = await say(
          `🆕 <b>Новый человек в боте</b>\n${who}\n` +
          `Пришёл: ${escapeHtml(SOURCES[source] || source)}\n\n` +
          '<i>Человек открыл бота, но пока ничего не написал. Написать ему можно уже сейчас: ответьте на это сообщение.</i>'
        );
        await Promise.all([remember(sent.result && sent.result.message_id, client), touchRecent(client)]);
        return OK;
      }

      if (text && text.length <= 3500) {
        const sent = await say(`💬 ${who}\n\n${escapeHtml(text)}`);
        await remember(sent.result && sent.result.message_id, client);
      } else {
        // Фото, файл, голосовое и т.п.: строка с именем, под ней копия самого сообщения
        const head = await say(`💬 ${who}\n${text ? 'Длинное сообщение' : kindOf(msg)} (ниже)`);
        const headId = head.result && head.result.message_id;
        const copy = await tg('copyMessage', {
          chat_id: OWNER,
          from_chat_id: client.id,
          message_id: msg.message_id,
          ...(headId ? { reply_parameters: { message_id: headId } } : {})
        });
        if (!copy.ok) await say('Это сообщение показать не удалось (такой тип не поддерживается). Попросите человека прислать его текстом или файлом.');
        await Promise.all([remember(headId, client), remember(copy.result && copy.result.message_id, client)]);
      }
      await touchRecent(client);
      return OK;
    }

    // ===== Сообщения владельца =====
    if (/^\/(start|help)\b/.test(text)) {
      await say(HELP);
      return OK;
    }

    // Старый способ: /reply_123456789 текст ответа
    const legacy = /^\/reply_(\d+)\s+([\s\S]+)/.exec(text);
    if (legacy) {
      const res = await tg('sendMessage', { chat_id: legacy[1], text: legacy[2], link_preview_options: { is_disabled: true } });
      await say(res.ok ? `✅ Доставлено · #id${legacy[1]}` : '⚠️ Не доставлено. Скорее всего, человек остановил бота.');
      return OK;
    }
    if (text.startsWith('/')) {
      await say('Такой команды нет. Подсказка по боту: /help');
      return OK;
    }

    // Служебные записи чата (закрепление и т.п.) пропускаем
    const hasContent = text || msg.photo || msg.document || msg.voice || msg.video || msg.video_note ||
      msg.audio || msg.sticker || msg.animation || msg.contact || msg.location;
    if (!hasContent) return OK;

    const reply = msg.reply_to_message;
    if (reply) {
      const target = await resolveTarget(reply);
      if (target) {
        const result = await deliver(target, msg.message_id);
        const sent = await say(result.text);
        if (result.ok) {
          await Promise.all([remember(sent.result && sent.result.message_id, target), remember(msg.message_id, target)]);
        }
        return OK;
      }
      if (reply.from && reply.from.is_bot) {
        await say(
          'Это сообщение никому не отправлено.\n\n' +
          'Вы ответили на уведомление с сайта, а не на сообщение человека. Тому, кто оставил заявку или оплатил, через бота написать нельзя: свяжитесь по почте или телефону из уведомления.',
          { reply_parameters: { message_id: msg.message_id } }
        );
        return OK;
      }
    }

    // Сообщение без адресата: спрашиваем, кому отправить
    const recent = await getRecent();
    if (!recent.length) {
      await say(
        'Это сообщение никому не отправлено.\n\n' +
        'Чтобы ответить человеку, смахните его сообщение влево и напишите ответ. Подробнее: /help',
        { reply_parameters: { message_id: msg.message_id } }
      );
      return OK;
    }
    await say('Кому отправить это сообщение?', {
      reply_parameters: { message_id: msg.message_id },
      reply_markup: {
        inline_keyboard: [
          ...recent.slice(0, 6).map((c) => [{
            text: `${String(c.name).slice(0, 32)} · ${ago(c.ts)}`,
            callback_data: `to:${c.id}`
          }]),
          [{ text: 'Никому, не отправлять', callback_data: 'cancel' }]
        ]
      }
    });
    return OK;
  } catch (e) {
    // Telegram повторяет запрос при ошибке, поэтому всегда отвечаем 200
    console.error('tg-webhook failed:', e.message);
    return OK;
  }
};
