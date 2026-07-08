import React from 'react';
import { motion } from 'framer-motion';
import { Users2, Trophy, HeartHandshake, ShieldCheck } from 'lucide-react';

const stats = [
  { label: 'Протестировано', value: '2500+', icon: Users2, color: 'text-brand-yellow' },
  { label: 'Обучено коллег', value: '2000+', icon: HeartHandshake, color: 'text-brand-accent' },
  { label: 'Лет опыта в HR', value: '15+', icon: Trophy, color: 'text-brand-green' }
];

const results = [
  { multiplier: 'x2', text: 'Уменьшение текучести персонала' },
  { multiplier: 'x6', text: 'Повышение вовлеченности персонала' },
  { multiplier: 'x3', text: 'Увеличение эффективности команд' },
  { multiplier: 'ROI', text: 'Научно доказанный рост прибыли' }
];

export default function WhyGallup() {
  return (
    <section id="methodology" className="relative bg-white selection:bg-brand-yellow selection:text-brand-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 py-14 md:py-24">
        {/* Why Gallup Section */}
        <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-center mb-20 md:mb-40">
          <motion.div 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-brand-dark uppercase tracking-tighter italic mb-8 leading-none">
              Почему <span className="text-brand-accent not-italic">Gallup?</span>
            </h2>
            <div className="h-2 w-32 bg-brand-yellow mb-12"></div>
            <div className="space-y-8 text-xl text-gray-600 font-medium leading-relaxed">
              <p>
                Методология <span className="text-brand-dark font-bold">CliftonStrengths®</span> от Gallup — это золотой стандарт в развитии талантов, основанный на 40 годах исследований.
              </p>
              <p>
                Вместо того чтобы тратить годы на исправление "слабостей", мы учим инвестировать в то, что дано вам природой. Это в <span className="text-brand-accent font-bold">6 раз эффективнее</span> — для отдельного человека, команды или всей компании.
              </p>
            </div>
          </motion.div>

          <div className="space-y-4">
             {results.map((res, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, x: 20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 whileHover={{ x: 10 }}
                 className="flex items-center gap-6 p-6 bg-brand-light rounded-[2rem] border border-transparent hover:border-brand-accent/20 transition-all duration-300 group"
               >
                 <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-brand-dark rounded-2xl flex items-center justify-center text-3xl font-black text-brand-yellow italic shadow-lg group-hover:bg-brand-accent transition-colors">
                    {res.multiplier}
                 </div>
                 <p className="text-lg md:text-xl font-black text-brand-dark tracking-tight uppercase leading-none italic">
                   {res.text}
                 </p>
               </motion.div>
             ))}
          </div>
        </div>
      </div>

      {/* Revitalized Experience Section - Dark Panel */}
      <div className="bg-brand-dark py-16 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 blur-[100px]">
           <div className="absolute top-0 left-0 w-96 h-96 bg-brand-accent rounded-full -translate-x-1/2 -translate-y-1/2"></div>
           <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-yellow rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
           <div className="max-w-2xl mb-14 md:mb-24">
              <div className="flex items-center gap-4 mb-6">
                <ShieldCheck className="text-brand-yellow" size={32} />
                <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-yellow italic">Certified Experience</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">Наш опыт <br/> и экспертиза</h2>
           </div>
           
           <div className="grid md:grid-cols-3 gap-12">
             {stats.map((stat, idx) => (
               <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative"
               >
                 <div className="text-[12rem] font-black text-white/5 absolute -top-16 -left-8 leading-none select-none group-hover:text-brand-accent/10 transition-colors">
                   {idx + 1}
                 </div>
                 <div className="relative z-10">
                   <div className={`text-7xl md:text-9xl font-black mb-4 tracking-tighter transition-all group-hover:translate-x-4 ${stat.color} drop-shadow-2xl`}>
                     {stat.value}
                   </div>
                   <div className="text-sm font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors pl-2">
                     {stat.label}
                   </div>
                 </div>
                 <div className="mt-12 h-px w-full bg-white/10 group-hover:bg-brand-yellow/30 transition-colors"></div>
               </motion.div>
             ))}
           </div>
        </div>
      </div>
    </section>
  );
}
