// Серверная точка входа: используется ТОЛЬКО при сборке (scripts/prerender.mjs),
// чтобы превратить каждую публичную страницу в готовый HTML.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import { LANDINGS, SITE_URL } from './seo/pages'
import { PAGE_TITLE, PAGE_DESC, FAQ as PROGRAM_FAQ } from './components/Program'

export function render(path) {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>
  )
}

const faqSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a }
  }))
})

const breadcrumbSchema = (name, url) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL + '/' },
    { '@type': 'ListItem', position: 2, name, item: url }
  ]
})

const provider = { '@type': 'Organization', name: 'Strengths Academy', url: SITE_URL }

function landingRoute(page) {
  const url = SITE_URL + page.path
  const faq = page.sections.find((s) => s.type === 'faq')
  const { schema } = page

  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: schema.name,
    description: schema.description,
    url,
    provider,
    areaServed: 'RU',
    offers: schema.lowPrice
      ? { '@type': 'AggregateOffer', priceCurrency: 'RUB', lowPrice: schema.lowPrice, url }
      : { '@type': 'Offer', priceCurrency: 'RUB', price: schema.price, url, availability: 'https://schema.org/InStock' }
  }

  return {
    path: page.path,
    title: page.meta.title,
    description: page.meta.description,
    jsonLd: [service, breadcrumbSchema(page.crumb, url), ...(faq ? [faqSchema(faq.items)] : [])]
  }
}

// Список страниц для пререндера. Главная оставляет <head> из index.html как есть.
// /admin, /payment-success и /payment-fail сюда НЕ входят: это служебные страницы,
// они рисуются в браузере.
export const routes = [
  { path: '/' },
  {
    path: '/program',
    title: PAGE_TITLE,
    description: PAGE_DESC,
    jsonLd: [
      breadcrumbSchema('Онлайн-программа', SITE_URL + '/program'),
      faqSchema(PROGRAM_FAQ)
    ]
  },
  ...Object.values(LANDINGS).map(landingRoute)
]
