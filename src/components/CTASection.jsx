import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Sparkles } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 bg-white px-6">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto relative overflow-hidden bg-brand-dark rounded-[4rem] p-12 md:p-20 text-white"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-accent/10 -skew-x-12 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="text-brand-yellow" size={24} />
              <span className="text-sm font-black uppercase tracking-[0.3em] text-brand-yellow italic">Ready to transform?</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.9] mb-10">
              Напишите <br/> новую главу <br/> <span className="text-brand-accent not-italic">Вашей команды</span>
            </h2>
            <p className="text-xl text-blue-100/60 font-medium leading-relaxed max-w-md">
              Оставьте заявку на бесплатную диагностику состава команды и узнайте скрытый потенциал ваших лидеров.
            </p>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 space-y-8">
               <div className="flex items-center gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                   <Target size={28} />
                 </div>
                 <div>
                   <h4 className="font-black uppercase italic text-lg leading-none mb-1">Диагностика Команды</h4>
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">45 минут / Zoom</p>
                 </div>
               </div>
               
               <div className="space-y-4">
                  <input type="text" placeholder="Ваше имя" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-yellow transition-colors" />
                  <input type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-yellow transition-colors" />
               </div>
               
               <button className="w-full py-5 bg-brand-yellow text-brand-dark rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-yellow/10">
                 Записаться на диагностику
               </button>
            </div>
            
            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-white/30">
              Нажимая на кнопку, вы соглашаетесь с политикой конфиденциальности.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
