import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Target, BrainCircuit, ShieldCheck, Flame } from 'lucide-react';
import Modal from './Modal';

const programs = [
  {
    title: 'HiPRO Team (Mix)',
    audience: 'Для амбициозных команд и лидеров',
    purpose: 'Создавай мощные команды, управляй взаимодействием, достигай целей. Сформируем команду под любую задачу через ДНК сильных сторон.',
    duration: 'Программа "под ключ"',
    points: [
      'Сформировать команды под любые задачи',
      'Выстроить взаимодействие для целей',
      'Создать ясную коммуникацию',
      'Опрос на вовлеченность Q12',
      'ДНК вашей команды'
    ],
    mechanics: [
      { num: '01', title: 'Тест Gallup', desc: 'Прохождение опросника для получения иерархии ваших талантов.' },
      { num: '02', title: 'Strengths Leadership', desc: 'Базовый тренинг (2 дня): знакомство с методологией и своими талантами.' },
      { num: '03', title: 'Индивидуальный разбор 1:1', desc: 'Расшифровка теста, разбор кейсов и составление плана действий.' },
      { num: '04', title: 'Опрос Q12', desc: 'Получение ДНК вашей команды и результатов вовлеченности.' },
      { num: '05', title: 'Strengths Team', desc: 'Тренинг (1 день): обратная связь, "подвалы" талантов и взаимодействие.' },
      { num: '06', title: 'Разбор команды 1:1', desc: 'Понимание баланса сил в команде и того, как вы дополняете друг друга.' }
    ],
    color: 'bg-brand-dark',
    isFlagship: true
  },
  {
    title: 'Strengths Leadership',
    audience: 'Для руководителей',
    purpose: 'Обучение навыкам лидерства на основе сильных сторон. Понимание своего стиля и потребностей последователей.',
    duration: '2 дня',
    points: [
      '34 темы StrengthsFinder',
      '4 области лидерства',
      'Разрыв между талантом и навыком',
      'Стиль влияния лидера'
    ],
    mechanics: [
      { num: '01', title: 'Тестирование', desc: 'Выявление ТОП-34 талантов.' },
      { num: '02', title: 'Воркшоп', desc: 'Погружение в 4 домена лидерства.' },
      { num: '03', title: 'План развития', desc: 'Интеграция талантов в рабочие задачи.' }
    ],
    color: 'bg-brand-accent'
  },
  {
    title: 'Strengths Team',
    audience: 'Для работающих команд',
    purpose: 'Улучшение взаимодействия, повышение доверия и эффективное распределение задач в коллективе.',
    duration: '1 день',
    points: [
      'ДНК команды',
      'Коллективная сила',
      'Командные игры',
      'Характеристики сильных команд'
    ],
    mechanics: [
      { num: '01', title: 'Мапинг талантов', desc: 'Карта сильных сторон команды.' },
      { num: '02', title: 'Тренинг', desc: 'Практика взаимодействия.' },
      { num: '03', title: 'Командный план', desc: 'Шаги по ускорению результативности.' }
    ],
    color: 'bg-brand-green'
  }
];

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Sync selected product with URL hash for proper browser "Back" button behavior
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#program-')) {
        const index = parseInt(hash.split('-')[1]);
        if (!isNaN(index) && programs[index]) {
          setSelectedProduct(programs[index]);
          return;
        }
      }
      setSelectedProduct(null);
    };

    window.addEventListener('popstate', handleHashChange);
    // Handle initial hash on load
    handleHashChange();

    return () => window.removeEventListener('popstate', handleHashChange);
  }, []);

  const handleOpenProduct = (program, index) => {
    window.location.hash = `program-${index}`;
    setSelectedProduct(program);
  };

  const handleCloseProduct = () => {
    // Only remove hash if we are currently looking at a program hash
    if (window.location.hash.startsWith('#program-')) {
      window.history.back();
    } else {
      setSelectedProduct(null);
    }
  };

  return (
    <section id="products" className="py-32 bg-[#fafbfc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-12">
          <div className="max-w-2xl">
            <h2 className="text-6xl font-black text-brand-dark uppercase tracking-tighter italic mb-8">
              Наши <span className="text-brand-accent not-italic">Программы</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed italic border-l-4 border-brand-yellow pl-8">
               "Все продукты доступны только после прохождения Gallup теста"
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleOpenProduct(program, idx)}
              className={`group rounded-[3rem] p-8 shadow-xl cursor-pointer transition-all duration-500 flex flex-col border ${
                program.isFlagship ? 'bg-brand-dark text-white ring-4 ring-brand-yellow/20' : 'bg-white text-brand-dark border-gray-100 hover:border-brand-accent/20'
              }`}
            >
              <div className="flex justify-between items-start mb-10">
                 {program.isFlagship ? (
                   <div className="px-4 py-1.5 bg-brand-yellow text-brand-dark rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                     <Flame size={12} fill="currentColor" /> Flagship Program
                   </div>
                 ) : (
                   <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{program.duration}</span>
                 )}
                 <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              
              <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-6 leading-none">
                {program.title}
              </h3>
              
              <p className={`font-medium mb-10 flex-grow ${program.isFlagship ? 'text-gray-300' : 'text-gray-500'}`}>
                {program.purpose}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                 <span className={`text-[10px] font-black uppercase tracking-widest ${program.isFlagship ? 'text-brand-yellow' : 'text-brand-accent'}`}>Подробнее о механике</span>
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center ${program.isFlagship ? 'bg-white/10 text-white' : 'bg-brand-light text-brand-dark'}`}>
                    <Target size={18} />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={!!selectedProduct} 
        onClose={handleCloseProduct} 
        product={selectedProduct} 
      />
    </section>
  );
}
