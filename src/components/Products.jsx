import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Target, Flame, Sparkles, Users, User, Clock } from 'lucide-react';
import Modal from './Modal';
import Test from './Test';

export const programs = [
  // ============ B2C: Для физ. лиц ============
  {
    segment: 'b2c',
    payId: 'start',
    title: 'Старт с сильных сторон',
    audience: 'Самостоятельно',
    duration: 'Онлайн доступ',
    price: '10 000 ₽',
    badge: 'Старт',
    purpose: 'Получите полный отчёт о ваших 34 талантах по Gallup и научитесь применять их в карьере и жизни.',
    points: [
      'Отчёт по 34 талантам',
      'Отчёт ТОП-5',
      'Рекомендации по работе с отчётами',
      'Доступ к базе знаний Gallup'
    ],
    mechanics: [
      { num: '01', title: 'Тестирование Gallup', desc: 'Прохождение онлайн-опросника CliftonStrengths.' },
      { num: '02', title: 'Получение отчётов', desc: 'ТОП-5 и полные 34 темы талантов с расшифровкой.' },
      { num: '03', title: 'Самостоятельное изучение', desc: 'Работа с материалами в базе знаний Gallup.' }
    ],
    color: 'bg-brand-accent'
  },
  {
    segment: 'b2c',
    payId: 'career-consult',
    title: 'Карьерное консультирование',
    audience: 'Для частных лиц',
    duration: '1,5 часа + сопровождение',
    price: '50 000 ₽',
    badge: 'Хит',
    purpose: 'Индивидуальная консультация с коучем для построения карьерной стратегии на основе ваших талантов.',
    points: [
      'Консультация 1,5 часа онлайн/оффлайн',
      'Action plan и напоминания',
      'Посткоучинговое сопровождение 1–3 мес.',
      'Чек-листы и доп. материалы',
      'Доступ к базе знаний Gallup'
    ],
    mechanics: [
      { num: '01', title: 'Тестирование Gallup', desc: 'Прохождение CliftonStrengths.' },
      { num: '02', title: 'Консультация с коучем', desc: 'Разбор отчёта и формирование action plan.' },
      { num: '03', title: 'Telegram-сопровождение', desc: 'Поддержка коуча 1–3 месяца после сессии.' }
    ],
    color: 'bg-brand-dark'
  },
  {
    // Карточка ведёт на отдельный лендинг /program, а не открывает модалку
    segment: 'b2c',
    link: '/program',
    title: 'Сильные стороны: от таланта к мастерству',
    audience: 'Онлайн-программа',
    duration: '8 модулей × 2 часа',
    price: 'от 4 500 ₽',
    comingSoon: true,
    purpose: 'Восемь недель по методологии Gallup: от знакомства со своими талантами до личного плана развития на 90 дней. Каждую субботу онлайн, ведёт Евгения Кудрявцева.',
    points: [
      '8 живых встреч по 2 часа',
      'Рабочая тетрадь и дневник наблюдений',
      'Тест CliftonStrengths 34 на тарифах выше базового',
      'Индивидуальные коуч-сессии на премиум-тарифе',
      'Сертификат по завершении'
    ],
    mechanics: [
      { num: '01', title: 'Восемь суббот', desc: 'Живые встречи по 2 часа с практикой в парах и группах.' },
      { num: '02', title: 'Практика между модулями', desc: 'Задания, дневник наблюдений и короткие уроки.' },
      { num: '03', title: 'Личный план на 90 дней', desc: 'Сборка стратегии применения сильных сторон.' }
    ],
    color: 'bg-brand-green'
  },
  {
    segment: 'b2c',
    payId: 'career-coaching',
    title: 'Карьерный коучинг',
    audience: 'Follow-up сессии',
    duration: 'Серия сессий',
    price: '40 000 ₽',
    purpose: 'Продолжительный коучинг по работе с сильными сторонами после первой консультации.',
    points: [
      'Онлайн или оффлайн сессии',
      'Доступ к базе знаний Gallup',
      'Регулярная поддержка коуча'
    ],
    mechanics: [
      { num: '01', title: 'Серия сессий', desc: 'Регулярные встречи с коучем онлайн или оффлайн.' },
      { num: '02', title: 'Работа с целями', desc: 'Применение талантов к актуальным задачам.' }
    ],
    color: 'bg-brand-dark'
  },
  {
    segment: 'b2c',
    payId: 'teens',
    title: 'Профориентация подростков 16+',
    audience: 'Для подростка и родителя',
    duration: 'Парная консультация',
    price: '70 000 ₽',
    purpose: 'Помогаем подростку выбрать профессиональный путь на основе его уникальных талантов.',
    points: [
      'Отчёт по 34 талантам',
      'Отчёт ТОП-5',
      'Консультация 1,5 часа',
      'Обратная связь родителю',
      'Доступ к базе знаний Gallup'
    ],
    mechanics: [
      { num: '01', title: 'Тестирование подростка', desc: 'Прохождение CliftonStrengths.' },
      { num: '02', title: 'Парная консультация', desc: 'Сессия с подростком и родителем, 1,5 часа.' },
      { num: '03', title: 'Обратная связь родителю', desc: 'Отдельный разбор результатов и рекомендации.' }
    ],
    color: 'bg-brand-accent'
  },
  {
    segment: 'b2c',
    title: 'Strengths Camps',
    audience: 'Для семей',
    duration: 'Выездная программа',
    price: 'По запросу',
    comingSoon: true,
    purpose: 'Выездные лагеря с программой развития сильных сторон, спортом и SPA.',
    points: [
      'Авторская программа развития',
      'Спортивные активности',
      'SPA и восстановление',
      'Работа с коучем'
    ],
    mechanics: [
      { num: '01', title: 'Подбор программы', desc: 'Индивидуальный формат под запрос семьи.' },
      { num: '02', title: 'Выездная сессия', desc: 'Программа развития, спорт, SPA.' }
    ],
    color: 'bg-brand-green'
  },

  // ============ B2B: Для юр. лиц ============
  {
    segment: 'b2b',
    title: 'ДНК команды',
    audience: 'Ориентир: команда 8 чел.',
    duration: 'Отчёт + сессия',
    price: 'от 120 000 ₽',
    badge: 'Хит',
    purpose: 'Точная карта сильных сторон команды с письменными рекомендациями — лучший вход в работу с Gallup для бизнеса. Стоимость указана как ориентир на команду 8 человек, итог зависит от размера команды.',
    points: [
      'ДНК команды',
      'Отчёт по 34 талантам',
      'Отчёт ТОП-5',
      'Консультация 1,5 часа',
      'Письменные рекомендации'
    ],
    mechanics: [
      { num: '01', title: 'Тестирование команды', desc: 'CliftonStrengths для всех участников.' },
      { num: '02', title: 'Сборка ДНК', desc: 'Аналитика сильных сторон и баланса команды.' },
      { num: '03', title: 'Консультация и рекомендации', desc: 'Сессия 1,5 часа и письменные рекомендации.' }
    ],
    color: 'bg-brand-dark',
    isFlagship: true
  },
  {
    segment: 'b2b',
    title: 'Лидерство через сильные стороны',
    audience: 'Тренинг для лидеров',
    duration: '2 дня оффлайн',
    price: 'от 900 000 ₽',
    purpose: 'Двухдневный оффлайн тренинг для команды руководителей с глубоким разбором талантов и пост-сопровождением.',
    points: [
      '2-дневный оффлайн тренинг',
      'Отчёт по 34 талантам',
      'Отчёт ТОП-5',
      'Рекомендации по работе с отчётами',
      'Пост-тренинговое сопровождение HRD',
      'Доступ к базе знаний Gallup'
    ],
    mechanics: [
      { num: '01', title: 'Тестирование Gallup', desc: 'Все участники проходят CliftonStrengths.' },
      { num: '02', title: '2-дневный оффлайн тренинг', desc: 'Погружение в методологию и работа с талантами команды.' },
      { num: '03', title: 'Сопровождение HRD', desc: 'Пост-тренинговая поддержка HR-департамента.' }
    ],
    color: 'bg-brand-accent'
  },
  {
    segment: 'b2b',
    title: 'Программа HIPRO',
    audience: 'Ориентир: команда 8 чел.',
    duration: '6 месяцев',
    price: 'от 1 700 000 ₽',
    badge: 'Премиум',
    purpose: 'Комплексная 6-месячная программа: тренинг + индивидуальные сессии + ДНК команды + полное сопровождение. Стоимость указана как ориентир на команду 8 человек, итог зависит от размера команды.',
    points: [
      '2-дневный оффлайн тренинг',
      'Отчёты Gallup 34 и ТОП-5 для всех',
      'Индивидуальный разбор для каждого',
      'ДНК команды',
      'Пост-тренинговое сопровождение HRD',
      'Письменные рекомендации'
    ],
    mechanics: [
      { num: '01', title: 'Тестирование команды', desc: 'CliftonStrengths для всех участников.' },
      { num: '02', title: '2-дневный оффлайн тренинг', desc: 'Strengths Leadership: методология и таланты.' },
      { num: '03', title: 'Индивидуальные разборы 1:1', desc: 'Консультации 1,5 часа с коучем для каждого.' },
      { num: '04', title: 'ДНК команды', desc: 'Карта сильных сторон и письменные рекомендации.' },
      { num: '05', title: 'Сопровождение HRD', desc: 'Пост-тренинговая поддержка 6 месяцев.' }
    ],
    color: 'bg-brand-green'
  },
  {
    segment: 'b2b',
    title: 'Сессия обратной связи',
    audience: 'Для команд',
    duration: '4–8 часов',
    price: 'от 450 000 ₽',
    purpose: 'Тренинг по конструктивной обратной связи на основе сильных сторон команды.',
    points: [
      'Оффлайн или онлайн формат',
      'Артефакт на выходе',
      'Практика обратной связи'
    ],
    mechanics: [
      { num: '01', title: 'Подготовка', desc: 'Сбор контекста и адаптация программы.' },
      { num: '02', title: 'Тренинг 4–8 часов', desc: 'Практика обратной связи в формате воркшопа.' },
      { num: '03', title: 'Артефакт', desc: 'Командное соглашение по обратной связи.' }
    ],
    color: 'bg-brand-accent'
  },
  {
    segment: 'b2b',
    title: 'Индивидуальный разбор отчёта',
    audience: 'Для сотрудников',
    duration: '1,5 часа',
    price: 'от 50 000 ₽',
    purpose: 'Индивидуальная сессия с коучем для разбора результатов теста и формирования плана развития.',
    points: [
      'Консультация 1,5 часа онлайн/оффлайн',
      'Action plan и напоминания',
      'Посткоучинговое сопровождение 1–3 мес.',
      'Доступ к базе знаний Gallup'
    ],
    mechanics: [
      { num: '01', title: 'Тестирование', desc: 'Прохождение CliftonStrengths.' },
      { num: '02', title: 'Разбор отчёта', desc: 'Сессия 1,5 часа с коучем.' },
      { num: '03', title: 'Сопровождение', desc: 'Telegram-поддержка до 3 месяцев.' }
    ],
    color: 'bg-brand-dark'
  }
];

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [segment, setSegment] = useState('b2c');
  const [testOpen, setTestOpen] = useState(false);

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#program-')) {
        const index = parseInt(hash.split('-')[1]);
        if (!isNaN(index) && programs[index]) {
          setSelectedProduct(programs[index]);
          setSegment(programs[index].segment);
          return;
        }
      }
      setSelectedProduct(null);
    };

    const handleOpenTest = () => setTestOpen(true);

    window.addEventListener('popstate', handleHashChange);
    window.addEventListener('open-test', handleOpenTest);
    handleHashChange();

    return () => {
      window.removeEventListener('popstate', handleHashChange);
      window.removeEventListener('open-test', handleOpenTest);
    };
  }, []);

  const handleOpenProduct = (program, index) => {
    // У программ с собственным лендингом модалки нет — уходим на отдельную страницу
    if (program.link) {
      window.location.href = program.link;
      return;
    }
    window.history.pushState({ program: index }, '', `#program-${index}`);
    setSelectedProduct(program);
  };

  const handleCloseProduct = () => {
    // Закрываем сразу через состояние — не зависим от popstate/history.back
    // (в Safari на iOS программный back() ненадёжен, модалка не закрывалась крестиком).
    setSelectedProduct(null);
    if (window.location.hash.startsWith('#program-')) {
      window.history.back();
    }
  };

  const filtered = programs
    .map((p, i) => ({ ...p, originalIndex: i }))
    .filter(p => p.segment === segment && !p.hidden);

  return (
    <section id="products" className="py-16 md:py-32 bg-[#fafbfc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 md:mb-12 gap-8 md:gap-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-brand-dark uppercase tracking-tighter italic mb-6 md:mb-8">
              Наши <span className="text-brand-accent not-italic">Программы</span>
            </h2>
            <p className="text-base md:text-lg text-gray-500 font-medium leading-relaxed">
              Старт — бесплатный онлайн-тест. Дальше — выбор пути для себя или для команды.
            </p>
          </div>
        </div>

        {/* Free test banner */}
        <motion.button
          type="button"
          onClick={() => setTestOpen(true)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.01 }}
          className="w-full text-left block mb-10 md:mb-14 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 bg-gradient-to-r from-brand-yellow/20 via-brand-yellow/10 to-transparent border border-brand-yellow/40 group"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-brand-yellow rounded-2xl flex items-center justify-center text-brand-dark shrink-0 shadow-lg">
              <Sparkles size={28} />
            </div>
            <div className="flex-grow">
              <div className="text-[10px] font-black uppercase tracking-widest text-brand-dark/60 mb-1">Бесплатно · Старт</div>
              <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-brand-dark leading-tight">
                Тест «Метапрограммы»: как вы принимаете решения
              </h3>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                12 вопросов · 7 минут · разбор вашего профиля по 4 метапрограммам.
              </p>
            </div>
            <div className="hidden md:flex w-12 h-12 rounded-full bg-brand-dark text-white items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowUpRight size={20} />
            </div>
          </div>
        </motion.button>

        {/* Segment toggle */}
        <div className="flex flex-col items-center mb-8 md:mb-10">
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-brand-dark/50 mb-3">
            Выберите аудиторию
          </p>
          <div className="inline-flex p-1.5 bg-brand-light rounded-full shadow-inner border border-gray-200">
            <button
              onClick={() => setSegment('b2c')}
              className={`flex items-center gap-2 px-5 md:px-8 py-3 md:py-3.5 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs transition-all ${
                segment === 'b2c'
                  ? 'bg-brand-dark text-white shadow-lg'
                  : 'bg-white text-brand-dark hover:bg-brand-dark/5 shadow-sm'
              }`}
            >
              <User size={14} /> Для себя
            </button>
            <button
              onClick={() => setSegment('b2b')}
              className={`flex items-center gap-2 px-5 md:px-8 py-3 md:py-3.5 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs transition-all ${
                segment === 'b2b'
                  ? 'bg-brand-dark text-white shadow-lg'
                  : 'bg-white text-brand-dark hover:bg-brand-dark/5 shadow-sm'
              }`}
            >
              <Users size={14} /> Для компании
            </button>
          </div>
        </div>

        <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 md:mb-8">
          ↓ Кликните на карточку для деталей
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={segment}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10"
          >
            {filtered.map((program) => (
              <motion.div
                key={program.originalIndex}
                whileHover={{ y: -6 }}
                onClick={() => handleOpenProduct(program, program.originalIndex)}
                className={`group relative rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 shadow-xl cursor-pointer transition-all duration-500 flex flex-col border ${
                  program.isFlagship
                    ? 'bg-brand-dark text-white ring-4 ring-brand-yellow/30'
                    : 'bg-white text-brand-dark border-gray-100 hover:border-brand-accent/30 hover:shadow-2xl'
                }`}
              >
                {program.comingSoon ? (
                  <div className="absolute -top-3 left-6 md:left-8 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md bg-gray-200 text-gray-500">
                    <Clock size={11} /> Скоро
                  </div>
                ) : program.badge && (
                  <div className={`absolute -top-3 left-6 md:left-8 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md ${
                    program.isFlagship ? 'bg-brand-yellow text-brand-dark' : 'bg-brand-accent text-white'
                  }`}>
                    <Flame size={11} fill="currentColor" /> {program.badge}
                  </div>
                )}

                <div className="flex justify-between items-start mb-5 md:mb-6">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${program.isFlagship ? 'text-white/50' : 'text-brand-dark/40'}`}>
                    {program.duration}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${program.isFlagship ? 'text-brand-yellow' : 'text-brand-accent'}`}>
                    {program.audience}
                  </span>
                </div>

                {/* Размер подобран под самое длинное слово («КОНСУЛЬТИРОВАНИЕ»): раньше оно
                    вылезало за карточку на планшетах и ноутбуках шириной до 1280px. */}
                <h3 className="text-xl min-[360px]:text-[1.375rem] min-[380px]:text-2xl sm:text-xl md:text-[1.375rem] lg:text-[1.7rem] font-black uppercase italic tracking-tighter mb-4 md:mb-5 leading-[0.95]">
                  {program.title}
                </h3>

                <p className={`text-sm md:text-base font-medium mb-6 md:mb-8 flex-grow ${program.isFlagship ? 'text-gray-300' : 'text-gray-500'}`}>
                  {program.purpose}
                </p>

                <div className={`mt-auto pt-5 md:pt-6 border-t ${program.isFlagship ? 'border-white/10' : 'border-gray-100'}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${program.isFlagship ? 'text-white/40' : 'text-gray-400'}`}>
                        Стоимость
                      </span>
                      <span className={`text-base md:text-lg font-black tracking-tight ${program.isFlagship ? 'text-brand-yellow' : 'text-brand-dark'}`}>
                        {program.price}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-black uppercase tracking-widest text-[10px] transition-all group-hover:gap-3 ${
                      program.comingSoon
                        ? 'bg-gray-100 text-gray-400'
                        : program.isFlagship
                        ? 'bg-brand-yellow text-brand-dark'
                        : 'bg-brand-dark text-white group-hover:bg-brand-accent'
                    }`}>
                      {program.comingSoon ? 'Скоро' : program.link ? 'Смотреть программу' : 'Подробнее'} <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-xs md:text-sm text-gray-400 font-medium italic mt-10 md:mt-14 max-w-2xl mx-auto">
          * Все программы (кроме бесплатного теста) доступны после прохождения Gallup CliftonStrengths.
        </p>
      </div>

      <Modal
        isOpen={!!selectedProduct}
        onClose={handleCloseProduct}
        product={selectedProduct}
      />

      <Test isOpen={testOpen} onClose={() => setTestOpen(false)} />
    </section>
  );
}
