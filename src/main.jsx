import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App, { normalizePath } from './App.jsx'

const container = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// При сборке каждая публичная страница пререндерится в свой HTML-файл,
// а корневой <div id="root"> получает data-route с её адресом.
// Если адрес совпал — «оживляем» готовую разметку (hydrate).
// Если нет (например /admin или /payment-success, для которых хостинг отдаёт
// index.html главной) — выбрасываем чужую разметку и рисуем страницу с нуля.
const prerenderedRoute = container.dataset.route
if (prerenderedRoute && prerenderedRoute === normalizePath(window.location.pathname)) {
  hydrateRoot(container, app)
} else {
  container.innerHTML = ''
  document.documentElement.classList.remove('spa-fallback')
  createRoot(container).render(app)
}
