import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhyGallup from './components/WhyGallup'
import Products from './components/Products'
import Team from './components/Team'
import Reviews from './components/Reviews'
import News from './components/News'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import FloatingCTA from './components/FloatingCTA'
import TalentWheel from './components/TalentWheel'
import Clients from './components/Clients'
import Admin from './components/Admin'
import PaymentResult from './components/PaymentResult'
import Program from './components/Program'
import Landing from './components/Landing'
import { LANDINGS } from './seo/pages'

// Убираем хвостовой слэш: '/program/' → '/program', '/' остаётся '/'
export function normalizePath(p) {
  return (p || '/').replace(/\/+$/, '') || '/';
}

// `path` передаёт пререндер (scripts/prerender.mjs). В браузере берём из адреса.
function App({ path: pathProp }) {
  // Simple client-side routing: /admin → admin panel, /payment-* → payment result
  const raw = pathProp ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
  const path = normalizePath(raw);

  if (path === '/admin') {
    return <Admin />;
  }
  if (path.startsWith('/payment-success')) {
    return <PaymentResult ok={true} />;
  }
  if (path.startsWith('/payment-fail')) {
    return <PaymentResult ok={false} />;
  }
  // Все роуты ОДНОУРОВНЕВЫЕ — Selectel отдаёт страницы только для путей
  // без вложенного слэша (см. CLAUDE.md, «Грабли»).
  if (path === '/program') {
    return <Program />;
  }
  if (LANDINGS[path]) {
    return <Landing page={LANDINGS[path]} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <WhyGallup />
      <Products />
      <TalentWheel />
      <Clients />
      <Reviews />
      <Team />
      <News />
      <CTASection />
      <Footer />
      <FloatingCTA />
    </div>
  )
}

export default App
