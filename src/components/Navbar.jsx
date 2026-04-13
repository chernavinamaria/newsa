import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Программы', href: '#products' },
    { name: 'Методология', href: '#methodology' },
    { name: 'Команда', href: '#team' },
    { name: 'Отзывы', href: '#reviews' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled ? 'py-4' : 'py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`
          relative flex items-center justify-between px-8 py-3 rounded-full transition-all duration-500
          ${isScrolled 
            ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,48,63,0.1)] border border-white/20' 
            : 'bg-white/10 backdrop-blur-sm border border-white/10'}
        `}>
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <img src={logoImg} alt="Strengths Academy" className="h-10 w-auto group-hover:scale-110 transition-transform" />
            <span className={`font-black uppercase tracking-tighter text-xl transition-colors ${isScrolled ? 'text-brand-dark' : 'text-brand-dark'}`}>
              Strengths <span className="text-brand-accent">Academy</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className="text-sm font-bold uppercase tracking-widest text-brand-dark/70 hover:text-brand-accent transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-yellow transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
             <a 
               href="https://t.me/+eiCreYeHm9k4ZGE0" 
               target="_blank" 
               rel="noopener noreferrer"
               className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-brand-dark text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand-accent transition-all shadow-lg hover:shadow-brand-accent/30"
             >
               Связаться
             </a>
             
             {/* Mobile Toggle */}
             <button 
               className="md:hidden p-2 text-brand-dark"
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             >
               {isMobileMenuOpen ? <X /> : <Menu />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-6 right-6 mt-4 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-black text-brand-dark uppercase italic tracking-tighter hover:text-brand-accent transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <hr className="border-gray-100" />
              <button className="w-full py-4 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">
                Оставить заявку
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
