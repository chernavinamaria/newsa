import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Программы', href: '#products' },
    { name: 'Методология', href: '#methodology' },
    { name: 'Команда', href: '#team' },
    { name: 'Отзывы', href: '#reviews' },
    { name: 'Новости', href: '#news' },
  ];

  const openTest = () => {
    setIsMobileMenuOpen(false);
    window.dispatchEvent(new CustomEvent('open-test'));
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled ? 'py-2 md:py-3' : 'py-3 md:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8">
        <div className={`
          relative flex items-center justify-between gap-3 transition-all duration-500
          ${isScrolled
            ? 'px-3 md:px-6 py-2 rounded-full bg-white/85 backdrop-blur-xl shadow-lg border border-white/40 max-w-[92%] md:max-w-full mx-auto'
            : 'px-4 md:px-6 py-2.5 md:py-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-md border border-gray-100'}
        `}>
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3 group cursor-pointer shrink-0" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className={`bg-brand-yellow rounded-lg flex items-center justify-center text-brand-dark font-black italic shadow-md shadow-brand-yellow/30 group-hover:scale-110 transition-all ${
              isScrolled ? 'w-8 h-8 text-sm' : 'w-9 h-9 md:w-10 md:h-10 text-sm md:text-base'
            }`}>
              SA
            </div>
            <span className={`font-black uppercase tracking-tighter text-brand-dark transition-all ${
              isScrolled ? 'hidden sm:inline text-sm md:text-base' : 'inline text-xs sm:text-sm md:text-base'
            }`}>
              Strengths <span className="text-brand-accent">Academy</span>
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-bold uppercase tracking-widest text-brand-dark/70 hover:text-brand-accent transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-yellow transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
             {/* Free test button — always visible */}
             <button
               onClick={openTest}
               className={`flex items-center gap-1.5 rounded-full font-black uppercase tracking-widest bg-brand-yellow text-brand-dark shadow-md hover:scale-105 transition-transform ${
                 isScrolled ? 'px-3 py-2 text-[9px] md:text-[10px]' : 'px-3 md:px-4 py-2 md:py-2.5 text-[9px] md:text-[10px]'
               }`}
             >
               <Sparkles size={11} className="shrink-0" />
               <span className="whitespace-nowrap">Бесплатный тест</span>
             </button>

             <a
               href="https://t.me/strengthsacademy_bot?start=fromsite"
               target="_blank"
               rel="noopener noreferrer"
               className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-brand-dark text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-brand-accent transition-all shadow-md whitespace-nowrap"
             >
               Связаться
             </a>

             {/* Mobile Toggle */}
             <button
               className="lg:hidden p-1.5 text-brand-dark"
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               aria-label="Меню"
             >
               {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
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
            className="absolute top-full left-3 right-3 mt-2 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-gray-100 lg:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-5">
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
              <button
                onClick={openTest}
                className="w-full py-4 bg-brand-yellow text-brand-dark rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
              >
                <Sparkles size={16} /> Пройти бесплатный тест
              </button>
              <a
                href="https://t.me/strengthsacademy_bot?start=fromsite"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest shadow-xl text-center"
              >
                Связаться в Telegram
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
