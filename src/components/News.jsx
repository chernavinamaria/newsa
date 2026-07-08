import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Newspaper, Sparkles, Globe } from 'lucide-react';

const articles = [
  {
    source: 'Gallup Workplace',
    tag: 'Исследование',
    color: 'bg-brand-yellow text-brand-dark',
    title: 'State of the Global Workplace 2026',
    titleRu: 'Отчёт Gallup: 77% сотрудников не вовлечены — что делать HR',
    excerpt: 'Ежегодный отчёт Gallup: разбор причин низкой вовлечённости, обзор инструментов и практик, работающих в 2026 году, влияние гибридного формата.',
    url: 'https://www.gallup.com/workplace/state-of-the-global-workplace.aspx',
    date: 'Июнь 2026'
  },
  {
    source: 'Josh Bersin',
    tag: 'AI в HR',
    color: 'bg-brand-accent text-white',
    title: 'The Rise of AI-Powered People Analytics',
    titleRu: 'Как ИИ меняет управление талантами: разбор от Josh Bersin',
    excerpt: 'Как AI-инструменты трансформируют оценку и развитие персонала, где нужен human-in-the-loop и почему полностью автоматизировать HR — плохая идея.',
    url: 'https://joshbersin.com/',
    date: 'Май 2026'
  },
  {
    source: 'Gallup CliftonStrengths',
    tag: 'Методология',
    color: 'bg-brand-dark text-white',
    title: 'Applying Strengths in Distributed Teams',
    titleRu: 'Как применять сильные стороны в удалённых командах: 5 практик',
    excerpt: 'Практический гид Gallup: распределение ролей по талантам, повышение доверия в распределённых командах, ритуалы обратной связи через сильные стороны.',
    url: 'https://www.gallup.com/cliftonstrengths/',
    date: 'Май 2026'
  },
  {
    source: 'Josh Bersin',
    tag: 'HR-Тренды',
    color: 'bg-brand-accent text-white',
    title: 'The End of Job Titles',
    titleRu: 'Skills-based организации: как компании отказываются от должностей',
    excerpt: 'Разбор перехода от жёсткой иерархии к skills-marketplace: что теперь ключевое для HR-функции, как строится найм и развитие.',
    url: 'https://joshbersin.com/',
    date: 'Апрель 2026'
  }
];

export default function News() {
  return (
    <section id="news" className="py-16 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Newspaper className="text-brand-accent" size={20} />
              <p className="text-brand-accent font-black uppercase tracking-[0.3em] text-xs italic">Интересное</p>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-brand-dark uppercase tracking-tighter mb-6 italic">
              Статьи и <span className="text-brand-accent not-italic">инсайты</span>
            </h2>
            <p className="text-base md:text-lg text-gray-500 font-medium leading-relaxed">
              Свежие материалы про развитие сильных сторон, управление персоналом, личный рост и HR-тренды. С коротким саммари на русском и ссылкой на оригинал.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-brand-yellow/20 rounded-full self-start md:self-end">
            <Sparkles size={14} className="text-brand-dark" />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">Автообновление · 1–2 раза в неделю</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {articles.map((article, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-brand-light p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 hover:border-brand-accent/30 hover:shadow-xl transition-all flex flex-col"
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${article.color}`}>
                  {article.tag}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-brand-dark/40">
                  <Globe size={12} /> EN
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/50">{article.source}</span>
                <span className="w-1 h-1 rounded-full bg-brand-dark/30"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">{article.date}</span>
              </div>

              <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tight text-brand-dark leading-tight mb-3">
                {article.titleRu}
              </h3>

              <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed mb-6 flex-grow">
                {article.excerpt}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-[10px] italic text-brand-dark/50">
                  Оригинал: <span className="font-bold">{article.title}</span>
                </span>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-brand-dark text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-accent transition-colors shrink-0"
                >
                  Читать <ArrowUpRight size={12} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
