import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center pt-24 md:pt-32 pb-12 overflow-hidden bg-white">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[80%] md:w-[50%] h-[60%] bg-gradient-to-bl from-brand-accent/10 via-brand-yellow/5 to-transparent rounded-full blur-[80px] md:blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[60%] md:w-[40%] h-[50%] bg-gradient-to-tr from-brand-green/10 via-transparent to-transparent rounded-full blur-[60px] md:blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-brand-dark/[0.03] text-brand-dark rounded-full mb-6 md:mb-8 border border-brand-dark/10 shadow-sm">
              <img src={logoImg} alt="logo" className="w-5 h-auto leading-none" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Gallup-Certified</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-brand-dark leading-[0.9] tracking-tighter uppercase italic mb-8 md:mb-10">
              Раскройте <br/>
              <span className="text-brand-accent not-italic">Силу</span> <br/>
              Талантов
            </h1>
            
            <div className="relative mb-10 md:mb-12 group max-w-lg md:max-w-none">
              <div className="absolute -left-4 md:-left-6 top-0 bottom-0 w-1 md:w-1.5 bg-brand-yellow group-hover:bg-brand-accent transition-colors"></div>
              <p className="text-lg sm:text-xl md:text-2xl text-brand-dark font-black leading-tight italic uppercase tracking-tighter pr-2 md:pr-4 pl-4 md:pl-0">
                "Мы не переделываем людей, а помогаем командам достигать сверхрезультатов, инвестируя в их таланты"
              </p>
            </div>
            
            <p className="text-base md:text-xl text-gray-500 font-medium leading-relaxed max-w-xl mb-10 md:mb-12">
              Strengths Academy — ведущая бизнес-школа, трансформирующая корпоративную культуру через научный подход Gallup.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full sm:w-auto">
              <motion.a 
                href="#products"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-fit px-10 md:px-12 py-4 md:py-5 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 group relative overflow-hidden text-sm md:text-base"
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
               <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/40 to-transparent"></div>
               
               <motion.div 
                 animate={{ y: [0, -20, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute top-12 -left-8 p-6 bg-white rounded-[2rem] shadow-2xl border border-gray-50 flex items-center gap-4"
               >
                  <img src={logoImg} className="w-10 h-auto" alt="logo" />
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-brand-dark leading-none">Strengths</span>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Academy</span>
                  </div>
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
