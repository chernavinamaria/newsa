import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhyGallup from './components/WhyGallup'
import Products from './components/Products'
import Team from './components/Team'
import Reviews from './components/Reviews'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import FloatingCTA from './components/FloatingCTA'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <WhyGallup />
      <Products />
      <Team />
      <Reviews />
      <CTASection />
      <Footer />
      <FloatingCTA />
    </div>
  )
}

export default App
