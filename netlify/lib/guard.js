// Общая защита для публичных функций: откуда пришёл запрос, как часто, какого размера.
// Лежит вне netlify/functions, чтобы Netlify не принял файл за отдельную функцию.

import { createHash, timingSafeEqual } from 'crypto';
import { getStore, setEnvironmentContext } from '@netlify/blobs';

const ALLOWED_ORIGINS = new Set([
  'https://www.strengthsacademy.ru',
  'https://strengthsacademy.ru',
  'https://wondrous-cannoli-7dc5a1.netlify.app' // стейджинг для коллег
]);
const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const MAX_BODY = 20000; // символов; самые большие настоящие запросы занимают около 2 КБ

function header(event, name) {
  const h = event.headers || {};
  return h[name] || h[name.toLowerCase()] || '';
}

export function originAllowed(event) {
  const origin = header(event, 'origin');
  return ALLOWED_ORIGINS.has(origin) || LOCAL_ORIGIN.test(origin);
}

// CORS-заголовки: отвечаем только своему сайту, а не «*».
export function cors(event) {
  const origin = header(event, 'origin');
  return {
    'Access-Control-Allow-Origin': originAllowed(event) ? origin : 'https://www.strengthsacademy.ru',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}

export function json(event, statusCode, body) {
  return {
    statusCode,
    headers: { ...cors(event), 'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff' },
    body: JSON.stringify(body)
  };
}

// Общая проверка для функций, которые вызывает сайт из браузера.
// Возвращает готовый ответ, если запрос надо отклонить, иначе null.
export function precheck(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors(event), body: '' };
  if (event.httpMethod !== 'POST') return json(event, 405, { error: 'Method Not Allowed' });
  if (!originAllowed(event)) return json(event, 403, { error: 'Forbidden' });
  if ((event.body || '').length > MAX_BODY) return json(event, 413, { error: 'Слишком большой запрос' });
  return null;
}

export function parseBody(event) {
  try {
    const data = JSON.parse(event.body || '{}');
    return data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

// Одна строка без управляющих символов и переносов, обрезанная до max.
// (\s в JavaScript включает и юникодные разделители строк.)
export function clean(value, max = 200) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[\x00-\x1f\x7f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

export function isEmail(value) {
  return typeof value === 'string' && value.length <= 254 && /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/.test(value);
}

export function escapeHtml(s) {
  return String(s ?? '').replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function clientIp(event) {
  return header(event, 'x-nf-client-connection-ip') || header(event, 'client-ip') ||
    String(header(event, 'x-forwarded-for')).split(',')[0].trim() || 'unknown';
}

const shortHash = (s) => createHash('sha256').update(String(s)).digest('hex').slice(0, 20);

// Ограничение частоты. rules: [{ by: 'ip' | 'all' | <любая строка>, limit, windowSec }]
// Счётчики лежат в Netlify Blobs (store sa-ratelimit); IP хранится только в виде хэша.
// Если хранилище недоступно, запрос пропускается: лучше принять заявку, чем потерять её.
// count: false означает «только проверить, не увеличивая счётчики».
// Подключение к Netlify Blobs. То же, что connectLambda из библиотеки, но дополнительно передаёт
// адрес для чтения без кэша: с ним счётчик виден сразу после записи (consistency: strong).
// Без него быстрые запросы подряд читали бы устаревшее значение и ограничение не срабатывало.
const rateStore = (event) => blobStore(event, 'sa-ratelimit');

export function blobStore(event, name) {
  const data = JSON.parse(Buffer.from(event.blobs, 'base64').toString('utf8'));
  setEnvironmentContext({
    deployID: event.headers['x-nf-deploy-id'],
    siteID: event.headers['x-nf-site-id'],
    edgeURL: data.url,
    uncachedEdgeURL: data.url_uncached,
    primaryRegion: data.primary_region,
    token: data.token
  });
  if (!data.url_uncached) console.warn('blobs: no uncached url, fields:', Object.keys(data).join(','));
  return getStore(data.url_uncached ? { name, consistency: 'strong' } : name);
}

export async function tooMany(event, name, rules, { count = true } = {}) {
  try {
    const store = rateStore(event);
    const keys = rules.map((rule) => {
      const bucket = Math.floor(Date.now() / (rule.windowSec * 1000));
      const who = rule.by === 'ip' ? `ip-${shortHash(clientIp(event))}` : rule.by === 'all' ? 'all' : `k-${shortHash(rule.by)}`;
      return `${name}/${rule.windowSec}/${bucket}/${who}`;
    });
    const current = await Promise.all(keys.map(async (key) => parseInt((await store.get(key)) || '0', 10) || 0));
    const blocked = current.some((n, i) => n >= rules[i].limit);
    if (count && !blocked) {
      await Promise.all(keys.map((key, i) => store.set(key, String(current[i] + 1))));
    }
    // Изредка подчищаем старые счётчики, чтобы хранилище не росло бесконечно
    if (Math.random() < 0.03) await cleanup(store, name).catch(() => {});
    return blocked;
  } catch (e) {
    console.error('rate limit unavailable:', e.message);
    return false;
  }
}

async function cleanup(store, name) {
  const { blobs } = await store.list({ prefix: `${name}/` });
  const now = Date.now();
  await Promise.all(blobs.slice(0, 200).map(({ key }) => {
    const [, windowSec, bucket] = key.split('/');
    const end = (Number(bucket) + 1) * Number(windowSec) * 1000;
    return end && end < now - 60000 ? store.delete(key) : null;
  }));
}

// Сравнение секретов без утечки по времени ответа
export function safeEqual(a, b) {
  const ha = createHash('sha256').update(String(a)).digest();
  const hb = createHash('sha256').update(String(b)).digest();
  return timingSafeEqual(ha, hb);
}
