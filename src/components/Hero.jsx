import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center pt-20 md:pt-32 pb-12 overflow-hidden bg-white">
      {/* Mobile-only background image */}
      <div className="absolute inset-0 lg:hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Brand gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/95 via-brand-dark/85 to-brand-dark/95"></div>
        {/* Dot grid pattern */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}></div>
        {/* Accent gradient blobs */}
        <div className="absolute top-0 right-0 w-[80%] h-[50%] bg-gradient-to-bl from-brand-accent/30 via-brand-yellow/10 to-transparent rounded-full blur-[80px] -translate-y-1/4 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[70%] h-[40%] bg-gradient-to-tr from-brand-green/20 via-transparent to-transparent rounded-full blur-[60px] translate-y-1/4 -translate-x-1/4"></div>
      </div>

      {/* Desktop-only background gradients */}
      <div className="hidden lg:block absolute top-0 right-0 w-[50%] h-[60%] bg-gradient-to-bl from-brand-accent/10 via-brand-yellow/5 to-transparent rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
      <div className="hidden lg:block absolute bottom-0 left-0 w-[40%] h-[50%] bg-gradient-to-tr from-brand-green/10 via-transparent to-transparent rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            {/* Mobile-only floating "Методология Gallup · 34 таланта" badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:hidden inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full shadow-lg mb-6"
            >
              <span className="text-2xl font-black italic leading-none text-brand-yellow">34</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">Таланта · Методология Gallup</span>
            </motion.div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white lg:text-brand-dark leading-[0.9] tracking-tighter uppercase italic mb-8 md:mb-10 drop-shadow-lg lg:drop-shadow-none">
              Раскройте <br/>
              <span className="text-brand-yellow lg:text-brand-accent not-italic">Силу</span> <br/>
              Талантов
            </h1>

            <div className="relative mb-10 md:mb-12 group max-w-lg md:max-w-none">
              <div className="absolute -left-4 md:-left-6 top-0 bottom-0 w-1 md:w-1.5 bg-brand-yellow group-hover:bg-brand-accent transition-colors"></div>
              <p className="text-lg sm:text-xl md:text-2xl text-white lg:text-brand-dark font-black leading-tight italic uppercase tracking-tighter pr-2 md:pr-4 pl-4 md:pl-0">
                "Мы не переделываем людей — мы помогаем каждому раскрыть свои сильные стороны и создавать команды, которые побеждают"
              </p>
            </div>

            <p className="text-base md:text-xl text-white/70 lg:text-gray-500 font-medium leading-relaxed max-w-xl mb-10 md:mb-12">
              Strengths Academy — методология Gallup для тех, кто хочет расти. Программы для людей, команд и целых компаний.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full sm:w-auto">
              <motion.a
                href="#products"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-fit px-10 md:px-12 py-4 md:py-5 bg-brand-yellow lg:bg-brand-dark text-brand-dark lg:text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 group relative overflow-hidden text-sm md:text-base"
              >
                <span className="relative z-10">К Программам</span>
                <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-brand-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 w-full aspect-square bg-[#f8f9fa] rounded-[4rem] group overflow-hidden border border-gray-100 shadow-2xl">
               <img
                 src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop"
                 alt="Business team"
                 className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-[3s]"
               />
               <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/50 via-brand-dark/20 to-transparent"></div>

               {/* Dot grid pattern overlay */}
               <div className="absolute inset-0 opacity-20" style={{
                 backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                 backgroundSize: '24px 24px'
               }}></div>

               {/* "34 таланта" centerpiece */}
               <motion.div
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 1, delay: 0.6 }}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center"
               >
                 <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-brand-yellow mb-1">Методология Gallup</span>
                 <span className="text-7xl md:text-8xl lg:text-9xl font-black italic text-white leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]">34</span>
                 <span className="text-sm md:text-base font-black uppercase tracking-widest text-white/90 mt-1">таланта</span>
               </motion.div>

               {/* Floating talent chip 1 — top */}
               <motion.div
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute top-4 md:top-6 right-4 md:right-8 px-3 py-1.5 md:px-4 md:py-2 bg-brand-yellow text-brand-dark rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg"
               >
                 Стратег
               </motion.div>

               {/* Floating talent chip 2 — left */}
               <motion.div
                 animate={{ y: [0, -8, 0] }}
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                 className="absolute top-1/3 left-3 md:left-6 px-3 py-1.5 md:px-4 md:py-2 bg-brand-accent text-white rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg"
               >
                 Эмпатия
               </motion.div>

               {/* Floating talent chip 3 — right */}
               <motion.div
                 animate={{ y: [0, 8, 0] }}
                 transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 className="absolute bottom-1/3 right-3 md:right-6 px-3 py-1.5 md:px-4 md:py-2 bg-white text-brand-dark rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg"
               >
                 Влияние
               </motion.div>

               {/* Floating talent chip 4 — bottom */}
               <motion.div
                 animate={{ y: [0, -6, 0] }}
                 transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                 className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 px-3 py-1.5 md:px-4 md:py-2 bg-brand-dark/80 backdrop-blur-md border border-white/20 text-white rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg"
               >
                 Достижение
               </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-20"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] rotate-90 mb-8 whitespace-nowrap">Scroll to explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-brand-dark to-transparent"></div>
        </motion.div>
      </div>
    </div>
  );
}
