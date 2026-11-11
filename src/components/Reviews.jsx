import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, X, ArrowRight } from 'lucide-react';

export const reviews = [
  {
    name: 'Абдуджаббор Абдувахидов',
    company: 'Директор по логистике · Auchan Russia',
    highlight: 'Продуктивность выросла на 25%, текучесть сократилась вдвое.',
    fullText: 'Продуктивность выросла на 25%, текучесть персонала сократилась вдвое, удовлетворённость клиентов — плюс 20%. Мы прошли программу «ДНК команды» и после неё смогли перераспределить роли на основе сильных сторон сотрудников. Ключевые люди перестали выгорать, а «неочевидные» игроки взяли на себя те задачи, где действительно раскрываются.',
    stars: 5
  },
  {
    name: 'Антон Сухарев',
    company: 'HR Director · Decathlon Hong Kong',
    highlight: 'Пожалуй, лучшая инвестиция за последние годы.',
    fullText: 'Пожалуй, лучшая инвестиция за последние годы. Результаты тренинга превзошли наши ожидания. Мы работали с коучами Strengths Academy и получили не просто отчёты по 34 талантам, а понимание, как эти таланты вплести в реальные бизнес-процессы. Через 6 месяцев у нас снизился churn на 30%, и мы наконец собрали команду, где каждый на своём месте.',
    stars: 5
  },
  {
    name: 'Ирина Рахмаилова',
    company: 'Recruitment & Adaptation Manager · Fintech',
    highlight: 'Когда видишь ДНК команды — это момент озарения.',
    fullText: 'Когда видишь ДНК команды — это момент озарения. Ты вдруг начинаешь понимать поведенческие паттерны людей и почему одни люди зажигаются от одних задач, а другие — от других. Мы теперь используем Gallup при найме и адаптации новых сотрудников. За полгода прошли путь от «интуитивного» найма к прозрачному подбору по совместимости талантов.',
    stars: 5
  },
  {
    name: 'Алексей Лешаков',
    company: 'Store Director · Decathlon Australia',
    highlight: 'StrengthsFinder стал незаменимым инструментом.',
    fullText: 'StrengthsFinder стал незаменимым инструментом для принятия взвешенных кадровых решений. Раньше при повышении сотрудника мы опирались на интуицию и результаты KPI. Сейчас смотрим на его ТОП-5 талантов и оцениваем, впишется ли он органично в новую роль. Ошибок стало значительно меньше, а рост внутренних сотрудников — стабильнее.',
    stars: 5
  }
];

export default function Reviews() {
  const [active, setActive] = useState(null);

  return (
    <section id="reviews" className="py-16 md:py-32 bg-brand-light relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-12 md:mb-16">
           <p className="text-brand-accent font-black uppercase tracking-[0.3em] mb-4 text-xs italic">Отзывы</p>
           <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-brand-dark uppercase tracking-tighter mb-6 md:mb-8 italic">Опыт внедрения <br/> и результаты</h2>
           <div className="h-2 w-24 bg-brand-yellow"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {reviews.map((review, idx) => (
            <motion.button
              key={idx}
              type="button"
              onClick={() => setActive(idx)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="text-left bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-gray-100 hover:border-brand-accent/30 hover:shadow-2xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1">
                    {[...Array(review.stars)].map((_, i) => (
                      <Star key={i} size={14} className="text-brand-yellow" fill="currentColor" />
                    ))}
                  </div>
                  <Quote size={20} className="text-brand-accent/30 group-hover:text-brand-accent transition-colors" fill="currentColor" />
                </div>
                <p className="text-lg md:text-2xl font-black italic text-brand-dark leading-tight mb-6 md:mb-8">
                  «{review.highlight}»
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-100">
                <div className="min-w-0">
                  <h4 className="font-black text-brand-dark text-sm md:text-base leading-tight truncate">{review.name}</h4>
                  <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest leading-tight mt-1 truncate">{review.company}</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent group-hover:text-brand-dark transition-colors shrink-0 flex items-center gap-1">
                  Читать <ArrowRight size={12} />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
        <p className="text-center text-xs md:text-sm text-gray-400 font-medium italic mt-8 md:mt-12">
          Скоро добавим фото и видео-отзывы клиентов.
        </p>
      </div>

      <AnimatePresence>
        {active !== null && reviews[active] && (
          <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
              className="absolute inset-0 bg-brand-dark/95 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full md:max-w-2xl md:max-h-[85vh] bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-y-auto flex flex-col"
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-3 bg-brand-light hover:bg-gray-200 rounded-full z-10 transition-colors text-brand-dark"
              >
                <X size={22} />
              </button>
              <div className="p-6 md:p-10 pt-16 md:pt-14">
                <div className="flex gap-1 mb-6">
                  {[...Array(reviews[active].stars)].map((_, i) => (
                    <Star key={i} size={18} className="text-brand-yellow" fill="currentColor" />
                  ))}
                </div>
                <p className="text-2xl md:text-3xl font-black italic text-brand-dark leading-tight mb-8 border-l-4 border-brand-yellow pl-6">
                  «{reviews[active].highlight}»
                </p>
                <p className="text-base md:text-lg text-gray-700 font-medium leading-relaxed mb-10">
                  {reviews[active].fullText}
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-brand-light">
                  <div className="w-14 h-14 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-black text-lg shrink-0">
                    {reviews[active].name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <h4 className="font-black text-brand-dark text-base md:text-lg">{reviews[active].name}</h4>
                    <p className="text-xs md:text-sm font-bold text-gray-500">{reviews[active].company}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
