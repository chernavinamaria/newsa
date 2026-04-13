import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const reviews = [
  {
    name: 'Management Team',
    text: 'Программа позволила нам заново открыть потенциал наших руководителей. Мы увидели, как сильные стороны каждого влияют на общую стратегию компании.',
    role: 'Кейс: Командная фасилитация',
    stars: 5
  },
  {
    name: 'HR-директор',
    text: 'Внедрение культуры сильных сторон значительно повысило вовлеченность персонала. Это был один из самых глубоких и практичных тренингов для нашей команды.',
    role: 'Кейс: Корпоративная программа',
    stars: 5
  },
  {
    name: 'CEO компании',
    text: 'Лучший инструмент для работы с талантами. Никакой воды, только научный подход и реальные инсайты для роста бизнеса.',
    role: 'Кейс: Индивидуальный коучинг',
    stars: 5
  }
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-32 bg-brand-light relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-24">
           <p className="text-brand-accent font-black uppercase tracking-[0.3em] mb-4 text-xs italic">Отзывы</p>
           <h2 className="text-5xl font-black text-brand-dark uppercase tracking-tighter mb-8 italic">Опыт внедрения <br/> и результаты</h2>
           <div className="h-2 w-24 bg-brand-yellow"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-8">
                  {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} size={14} className="text-brand-yellow" fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-600 font-medium text-lg italic leading-relaxed mb-12">
                  "{review.text}"
                </p>
              </div>
              
              <div className="flex items-center gap-4 border-t border-gray-50 pt-8">
                <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                   <Quote size={16} fill="currentColor" />
                </div>
                <div>
                  <h4 className="font-black text-brand-dark uppercase text-xs tracking-widest">{review.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
