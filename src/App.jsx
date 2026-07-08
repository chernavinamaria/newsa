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
import Admin from './components/Admin'
import PaymentResult from './components/PaymentResult'

function App() {
  // Simple client-side routing: /admin → admin panel, /payment/* → payment result
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  if (path === '/admin' || path === '/admin/') {
    return <Admin />;
  }
  if (path.startsWith('/payment-success')) {
    return <PaymentResult ok={true} />;
  }
  if (path.startsWith('/payment-fail')) {
    return <PaymentResult ok={false} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <WhyGallup />
      <Products />
      <TalentWheel />
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
