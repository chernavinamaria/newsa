// Пререндер: после `vite build` превращает каждую публичную страницу в готовый HTML.
//
// Зачем: без этого в HTML лежит пустой <div id="root"></div>, а весь текст
// появляется только после загрузки JavaScript. Поисковики и ИИ-ассистенты,
// которые не выполняют JS, видят пустую страницу; у всех адресов одинаковые
// title и description.
//
// Что делает:
//   1. берёт dist/index.html как шаблон;
//   2. для каждого маршрута из src/entry-server.jsx рендерит React в строку;
//   3. подставляет разметку в <div id="root">, меняет title / description /
//      canonical / og-теги, добавляет JSON-LD;
//   4. пишет dist/index.html (главная) и dist/<slug>.html (остальные).
//
// Деплой: deploy-selectel.cjs заливает dist/<slug>.html в бакет под ключом
// БЕЗ расширения (`gallup-test`), чтобы страница открывалась по /gallup-test.

import { readFile, writeFile, rm } from 'node:fs/promises'
import { pathToFileURL, fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')
const SITE_URL = 'https://www.strengthsacademy.ru'

const escAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Заменяет ровно одно вхождение, иначе падает: молчаливый промах здесь
// означал бы страницу с чужим title в выдаче.
function replaceOnce(html, pattern, replacement, label) {
  const matches = html.match(new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g'))
  if (!matches || matches.length !== 1) {
    throw new Error(`prerender: ожидалось одно вхождение «${label}», найдено ${matches ? matches.length : 0}`)
  }
  return html.replace(pattern, () => replacement)
}

const { render, routes } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
const template = await readFile(path.join(dist, 'index.html'), 'utf8')

if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender: в dist/index.html не найден пустой <div id="root"></div>')
}

for (const route of routes) {
  const appHtml = render(route.path)
  if (!appHtml || appHtml.length < 500) {
    throw new Error(`prerender: подозрительно пустая разметка для ${route.path}`)
  }

  let html = template
  const url = SITE_URL + (route.path === '/' ? '/' : route.path)

  if (route.title) {
    const t = route.title
    const d = route.description
    html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${escText(t)}</title>`, 'title')
    html = replaceOnce(html, /<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${escAttr(d)}" />`, 'description')
    html = replaceOnce(html, /<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`, 'canonical')
    html = replaceOnce(html, /<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`, 'og:url')
    html = replaceOnce(html, /<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${escAttr(t)}" />`, 'og:title')
    html = replaceOnce(html, /<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${escAttr(d)}" />`, 'og:description')
    html = replaceOnce(html, /<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${escAttr(t)}" />`, 'twitter:title')
    html = replaceOnce(html, /<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${escAttr(d)}" />`, 'twitter:description')
    // keywords в шаблоне относятся к главной; на остальных страницах тег не нужен
    html = html.replace(/\s*<meta name="keywords" content="[^"]*"\s*\/?>/, '')
  }

  // Хостинг отдаёт index.html главной и для служебных адресов (/admin, /payment-success).
  // Чтобы там не мелькала чужая страница, прячем разметку до старта React,
  // если адрес в браузере не совпал с адресом этого файла (см. src/main.jsx).
  const guard =
    `<style>.spa-fallback #root{display:none}</style>` +
    `<script>(function(){var p=location.pathname.replace(/\\/+$/,'')||'/';` +
    `if(p!==${JSON.stringify(route.path)})document.documentElement.classList.add('spa-fallback')})()</script>`

  const jsonLd = (route.jsonLd || [])
    .map((obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`)
    .join('\n    ')

  html = replaceOnce(html, /<\/head>/, `  ${guard}\n    ${jsonLd}\n  </head>`, '</head>')
  html = html.replace('<div id="root"></div>', () => `<div id="root" data-route="${route.path}">${appHtml}</div>`)

  const file = route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`
  await writeFile(path.join(dist, file), html, 'utf8')
  console.log(`prerender: ${route.path.padEnd(28)} → dist/${file} (${(html.length / 1024).toFixed(0)} КБ)`)
}

await rm(ssrDir, { recursive: true, force: true })
console.log(`prerender: готово, страниц: ${routes.length}`)
