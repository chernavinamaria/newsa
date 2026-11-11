import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, Sparkles, Plus, Minus,
  Calendar, Clock, Monitor, Award, Users
} from 'lucide-react';
import Footer from './Footer';
import { submitLead, PROGRAM_CHECKOUT } from '../config';
import evgeniaImg from '../assets/Evgenia.jpg';
import ekaterinaImg from '../assets/Ekaterina.jpg';

const AUDIENCE = [
  'хотите лучше понять свои сильные стороны и перестать жить «на усилии»',
  'часто чувствуете, что делаете много, но не всегда в своём ресурсе',
  'хотите использовать природные таланты в работе, коммуникации, решениях и личной жизни',
  'уже знакомы с CliftonStrengths или только начинаете путь в теме сильных сторон',
  'ищете не просто теорию, а рабочий инструмент на каждый день'
];

const STEPS = [
  { num: '01', title: 'Замечать', desc: 'свои природные паттерны мышления, эмоций и поведения' },
  { num: '02', title: 'Принимать', desc: 'их целиком, и сильные проявления, и рискованные' },
  { num: '03', title: 'Направлять', desc: 'в конкретные действия и результаты' }
];

const RESULTS = [
  'поймёте, чем талант отличается от навыка и от сильной стороны',
  'научитесь замечать свои повторяющиеся паттерны',
  'освоите язык CliftonStrengths и узнаете себя в 34 темах талантов',
  'увидите, как ваши таланты работают в ресурсе и в перегрузе',
  'поймёте, что подпитывает вашу энергию, а что её забирает',
  'соберёте личный план развития на 30, 60 и 90 дней',
  'начнёте применять сильные стороны в работе, отношениях и решениях'
];

const FORMAT = [
  {
    icon: Monitor,
    title: 'Живые встречи',
    desc: 'Каждую субботу с 11:00 до 13:00. Разбор, практика, работа в парах и малых группах. Запись остаётся у вас.'
  },
  {
    icon: Clock,
    title: 'Практика между встречами',
    desc: 'Одна ключевая идея, одна практика наблюдения, одно действие на применение, один шаг к личному плану.'
  },
  {
    icon: Award,
    title: 'Материалы и поддержка',
    desc: 'Рабочая тетрадь, дневник наблюдений, справочники по 34 темам, чат участников, короткие теоретические уроки.'
  }
];

const MODULES = [
  {
    date: '3 октября',
    title: 'Почему сильные стороны работают',
    desc: 'Знакомство, история подхода CliftonStrengths, чем талант отличается от навыка, почему фокус на слабостях даёт низкий возврат.',
    task: 'Упражнение «Мой лучший день»'
  },
  {
    date: '10 октября',
    title: 'Как устроен мой талант',
    desc: 'Четыре признака таланта, как читать 34 темы, как отличить «мне это знакомо» от «это действительно про меня».',
    task: 'Упражнение «Четыре фильтра»'
  },
  {
    date: '17 октября',
    title: 'Моя карта энергии: 4 домена',
    desc: 'Четыре домена CliftonStrengths, что значит доминирующий домен, какие задачи заряжают, а какие истощают.',
    task: 'Упражнение «Карта доменов»'
  },
  {
    date: '24 октября',
    title: 'Балкон и подвал таланта',
    desc: 'Как один и тот же талант помогает и мешает. Разбор на примерах из реальных ситуаций.',
    task: 'Упражнение «Мой балкон, мой подвал»'
  },
  {
    date: '31 октября',
    title: 'Талант становится силой',
    desc: 'Формула Talent × Investment, что именно инвестировать в талант, как не тратить силы на борьбу со слабостями.',
    task: 'Упражнение «Аудит инвестиций»'
  },
  {
    date: '7 ноября',
    title: 'Что питает мою силу',
    desc: 'Потребности талантов, что происходит, когда они не удовлетворены, как выстроить среду под себя.',
    task: 'Упражнение «Меню потребностей»'
  },
  {
    date: '14 ноября',
    title: 'Сильные стороны в отношениях и команде',
    desc: 'Как таланты работают в сочетаниях, идея strengths partnership, кого не хватает рядом с вами.',
    task: 'Упражнения «Карта партнёрств» и «Диалог талантов»'
  },
  {
    date: '21 ноября',
    title: 'Моя стратегия на 90 дней',
    desc: 'Сборка личного плана, цели на 30, 60 и 90 дней, презентация плана и обратная связь группы.',
    task: 'Упражнение «Письмо из будущего»'
  }
];

const TARIFFS = [
  {
    key: 'observer',
    name: 'Наблюдатель',
    price: '4 500 ₽',
    tagline: 'Для тех, кто хочет познакомиться с темой и начать замечать свои паттерны.',
    points: [
      '8 живых встреч по 2 часа',
      'рабочая тетрадь и дневник наблюдений',
      'справочники по 34 темам, доменам, балконам и подвалам',
      'задания между модулями',
      'чат участников',
      'записи всех встреч',
      'сертификат по завершении'
    ],
    note: 'Тест CliftonStrengths не входит. Его можно пройти отдельно или выбрать тариф выше.',
    dark: false
  },
  {
    key: 'researcher',
    name: 'Исследователь',
    price: '19 500 ₽',
    badge: 'Выбор большинства',
    tagline: 'Для тех, кому важна связка «обучение плюс личный профиль плюс первые шаги применения».',
    points: [
      'всё из тарифа «Наблюдатель»',
      'код на официальный тест CliftonStrengths 34 и полный отчёт Gallup',
      'расширенные материалы по вашим ведущим темам',
      'групповой разбор результатов с куратором, 60 минут',
      'сопровождение куратора в закрытом чате',
      'проверка вашего плана развития'
    ],
    dark: true
  },
  {
    key: 'architect',
    name: 'Архитектор',
    price: '49 000 ₽',
    tagline: 'Для тех, кто хочет персональную работу и собственную стратегию применения сильных сторон.',
    points: [
      'всё из тарифа «Исследователь»',
      'персональный разбор всех 34 тем вашего профиля с коучем',
      '4 индивидуальные коуч-сессии по 60 минут',
      'персональные задания после каждой сессии',
      'разбор ваших ситуаций: карьера, отношения, решения',
      'совместная разработка плана развития',
      '30 дней поддержки после программы'
    ],
    note: 'Не более 15 мест.',
    dark: false
  }
];

export const STATS = [
  { value: 'в 6 раз', desc: 'выше вовлечённость у людей, которые фокусируются на своих сильных сторонах' },
  { value: 'в 3 раза', desc: 'чаще они сообщают о высоком качестве жизни' },
  { value: '73% / 9%', desc: 'шанс быть вовлечённым, когда руководитель работает с сильными сторонами и когда нет' }
];

export const FAQ = [
  {
    q: 'Нужно ли проходить тест до старта?',
    a: 'На тарифе «Наблюдатель» тест не нужен, программа построена так, что вы начинаете с наблюдения за собой. На тарифах «Исследователь» и «Архитектор» вы проходите тест CliftonStrengths 34 на третьей неделе, код мы выдаём заранее.'
  },
  {
    q: 'Я никогда не слышал про CliftonStrengths. Мне подойдёт?',
    a: 'Да. Первые три модуля вводят в тему с нуля, без подготовки.'
  },
  {
    q: 'А если я уже проходил тест?',
    a: 'Отлично, у вас будет фора. Программа не про получение отчёта, а про то, что с ним делать дальше.'
  },
  {
    q: 'Что если я пропущу встречу?',
    a: 'Все встречи записываются, запись остаётся у вас. Но упражнения в парах работают только вживую, поэтому старайтесь быть.'
  },
  {
    q: 'Сколько времени нужно между модулями?',
    a: 'От 20 до 40 минут в неделю на задания плюс короткие ежедневные записи в дневник наблюдений.'
  },
  {
    q: 'Можно ли оплатить частями?',
    a: 'Да, оплату можно разбить на части. Напишите нам, и мы подберём удобный вариант.'
  },
  {
    q: 'Будет ли сертификат?',
    a: 'Да, по завершении программы вы получаете сертификат Strengths Academy.'
  }
];

function Accordion({ items, renderTitle, renderBody }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`rounded-3xl border transition-colors ${
              isOpen ? 'bg-white border-brand-accent/40 shadow-lg' : 'bg-white border-gray-200 hover:border-brand-accent/30'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 text-left p-6 md:p-7"
            >
              {renderTitle(item, i)}
              <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-colors ${
                isOpen ? 'bg-brand-accent text-white' : 'bg-brand-light text-brand-dark'
              }`}>
                {isOpen ? <Minus size={18} /> : <Plus size={18} />}
              </div>
            </button>
            {/* Ответ всегда в разметке (важно для поисковиков), сворачивается через CSS */}
            <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden">
                <div className="px-6 md:px-7 pb-6 md:pb-7">{renderBody(item, i)}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const PAGE_TITLE = 'Сильные стороны: от таланта к мастерству — онлайн-программа Strengths Academy';
export const PAGE_DESC = 'Онлайн-программа по методологии Gallup CliftonStrengths: 8 модулей по 2 часа, каждую субботу. Даты нового потока объявим скоро. Ведёт Евгения Кудрявцева.';

export default function Program() {
  const [form, setForm] = useState({ name: '', contact: '', tariff: 'Исследователь' });
  const [status, setStatus] = useState('idle');

  // Страница живёт в SPA, поэтому title и description проставляем руками —
  // иначе при отправке ссылки в мессенджер подтянется описание главной.
  React.useEffect(() => {
    const prevTitle = document.title;
    document.title = PAGE_TITLE;
    const set = (selector, attr, value) => {
      const el = document.querySelector(selector);
      const prev = el ? el.getAttribute(attr) : null;
      if (el) el.setAttribute(attr, value);
      return () => { if (el && prev !== null) el.setAttribute(attr, prev); };
    };
    const restores = [
      set('meta[name="description"]', 'content', PAGE_DESC),
      set('meta[property="og:title"]', 'content', PAGE_TITLE),
      set('meta[property="og:description"]', 'content', PAGE_DESC),
      set('link[rel="canonical"]', 'href', 'https://www.strengthsacademy.ru/program'),
      set('meta[property="og:url"]', 'content', 'https://www.strengthsacademy.ru/program')
    ];
    return () => {
      document.title = prevTitle;
      restores.forEach((fn) => fn());
    };
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const handleTariffClick = (t) => {
    const url = PROGRAM_CHECKOUT[t.key];
    if (url) {
      window.open(url, '_blank', 'noopener');
      return;
    }
    setForm((f) => ({ ...f, tariff: t.name }));
    scrollTo('program-form');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.contact) return;
    setStatus('sending');
    try {
      await submitLead({
        type: 'программа: сильные стороны',
        name: form.name,
        contact: form.contact,
        source: `Программа «Сильные стороны: от таланта к мастерству», тариф «${form.tariff}»`,
        notes: `Лист ожидания (даты уточняются). Выбранный тариф: ${form.tariff}`
      });
      // Цель в Яндекс.Метрике: заявка с лендинга программы (создать цель program-lead в счётчике)
      if (typeof window.ym === 'function') {
        window.ym(110314327, 'reachGoal', 'program-lead', { tariff: form.tariff });
      }
      setStatus('sent');
      setForm({ name: '', contact: '', tariff: form.tariff });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Шапка */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-yellow rounded-xl flex items-center justify-center text-brand-dark font-black text-lg italic">SA</div>
            <span className="font-black uppercase tracking-tighter text-lg md:text-xl italic text-brand-dark">
              Strengths <span className="text-brand-accent not-italic">Academy</span>
            </span>
          </a>
          <button
            onClick={() => scrollTo('tariffs')}
            className="px-5 md:px-7 py-3 bg-brand-dark text-white rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-brand-accent transition-colors"
          >
            Выбрать тариф
          </button>
        </div>
      </header>

      {/* Первый экран */}
      <section className="relative overflow-hidden bg-brand-dark text-white">
        {/* Фон: точечная сетка и цветные пятна, как на главной */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <div className="absolute top-0 right-0 w-[60%] h-[70%] bg-gradient-to-bl from-brand-accent/30 via-brand-yellow/10 to-transparent rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-gradient-to-tr from-brand-green/15 via-transparent to-transparent rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 md:py-24 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8">
                <Sparkles className="text-brand-yellow" size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">
                  Онлайн-программа Strengths Academy · Скоро
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.9] mb-8">
                Сильные <br />
                стороны: <br />
                <span className="text-brand-yellow not-italic">от таланта <br className="hidden sm:block" /> к мастерству</span>
              </h1>

              <div className="relative mb-10 pl-5">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-yellow" />
                <p className="text-base md:text-lg text-blue-100/80 font-medium leading-relaxed max-w-xl">
                  Как заметить свою природную силу, присвоить её и научиться применять в жизни и работе.
                  8 недель по методологии Gallup CliftonStrengths. Не тест ради теста, а способ превратить
                  самопонимание в ежедневную практику.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3 mb-10">
                {[
                  { icon: Calendar, text: '8 модулей по 2 часа' },
                  { icon: Clock, text: 'Каждую субботу, 11:00' },
                  { icon: Monitor, text: 'Онлайн' },
                  { icon: Award, text: 'Сертификат' }
                ].map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-[11px] md:text-xs font-black uppercase tracking-wider text-white/90"
                  >
                    <f.icon size={14} className="text-brand-yellow shrink-0" /> {f.text}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollTo('tariffs')}
                  className="px-9 md:px-11 py-5 bg-brand-yellow text-brand-dark rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm shadow-2xl shadow-brand-yellow/10 inline-flex items-center justify-center gap-3 group"
                >
                  Записаться в лист ожидания
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/40 leading-relaxed">
                  Даты старта объявим скоро <br className="hidden sm:block" />
                  На «Архитекторе» 15 мест
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Кому это */}
      <section className="py-16 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-brand-dark mb-4">
            Узнали <span className="text-brand-accent not-italic">себя?</span>
          </h2>
          <div className="h-1.5 w-24 bg-brand-yellow mb-10" />
          <p className="text-lg font-bold text-brand-dark mb-8">Программа для вас, если вы:</p>
          <ul className="space-y-4">
            {AUDIENCE.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <CheckCircle2 size={22} className="text-brand-accent shrink-0 mt-0.5" />
                <span className="text-base md:text-lg text-gray-700 font-medium leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Главная идея */}
      <section className="py-16 md:py-28 bg-brand-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-brand-dark mb-4 max-w-3xl">
            Мы не «изучаем сильные стороны». <br />
            <span className="text-brand-accent not-italic">Мы учимся ими пользоваться</span>
          </h2>
          <div className="h-1.5 w-24 bg-brand-yellow mb-12 md:mb-16" />

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {STEPS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[2rem] p-8 md:p-6 lg:p-10 border border-gray-100"
              >
                <span className="text-5xl md:text-6xl font-black italic text-brand-yellow leading-none">{s.num}</span>
                <h3 className="text-2xl md:text-xl lg:text-2xl font-black uppercase italic tracking-tighter text-brand-dark mt-6 mb-3">{s.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-brand-dark text-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 mt-12 md:mt-16 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">
              Формула Gallup
            </p>
            <p className="text-2xl md:text-4xl font-black italic uppercase tracking-tight text-brand-yellow leading-tight">
              Сильная сторона = талант × инвестиции
            </p>
          </div>
        </div>
      </section>

      {/* Что получите */}
      <section className="py-16 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-brand-dark mb-4">
            Что вы получите <span className="text-brand-accent not-italic">за 8 недель</span>
          </h2>
          <div className="h-1.5 w-24 bg-brand-yellow mb-10" />
          <ul className="space-y-4">
            {RESULTS.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <CheckCircle2 size={22} className="text-brand-green shrink-0 mt-0.5" />
                <span className="text-base md:text-lg text-gray-700 font-medium leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Формат */}
      <section className="py-16 md:py-28 bg-brand-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-brand-dark mb-4">
            Восемь недель, <span className="text-brand-accent not-italic">восемь шагов</span>
          </h2>
          <div className="h-1.5 w-24 bg-brand-yellow mb-12" />
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {FORMAT.map((f, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-8 border border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 text-brand-accent flex items-center justify-center mb-6">
                  <f.icon size={26} />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-brand-dark mb-3">{f.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Модули */}
      <section className="py-16 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-brand-dark mb-4">
            Что <span className="text-brand-accent not-italic">внутри</span>
          </h2>
          <div className="h-1.5 w-24 bg-brand-yellow mb-10" />

          <Accordion
            items={MODULES}
            renderTitle={(m, i) => (
              <div className="flex items-start gap-4 md:gap-6">
                <span className="text-2xl md:text-3xl font-black italic text-brand-yellow leading-none shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-accent mb-1">Модуль {String(i + 1).padStart(2, '0')}</p>
                  <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter text-brand-dark leading-tight">
                    {m.title}
                  </h3>
                </div>
              </div>
            )}
            renderBody={(m) => (
              <div className="pl-0 md:pl-[4.5rem]">
                <p className="text-gray-600 font-medium leading-relaxed mb-4">{m.desc}</p>
                <p className="inline-block px-4 py-2 bg-brand-light rounded-full text-xs font-black uppercase tracking-widest text-brand-dark">
                  {m.task}
                </p>
              </div>
            )}
          />
        </div>
      </section>

      {/* Ведущая */}
      <section className="py-16 md:py-28 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">
            Кто <span className="text-brand-accent not-italic">ведёт</span>
          </h2>
          <div className="h-1.5 w-24 bg-brand-yellow mb-12" />

          <p className="text-base md:text-lg text-blue-100/70 font-medium leading-relaxed max-w-3xl mb-12">
            Все восемь модулей ведёт Евгения. Индивидуальные коуч-сессии на тарифе «Архитектор»
            вы проходите с Евгенией или Екатериной, обе сертифицированы по Gallup CliftonStrengths.
          </p>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                img: evgeniaImg,
                // Кадрирование как в блоке «Наши эксперты» на главной: у Жени лицо по центру кадра
                imgPos: '50% 50%',
                role: 'Ведёт все 8 модулей и коуч-сессии',
                name: 'Евгения Кудрявцева',
                position: 'Co-founder · Бизнес-тренер',
                bio: 'В HR более 15 лет. Дипломированный бизнес-тренер, сертифицированный международный фасилитатор, архитектор образовательных программ. Сертифицированный коуч Gallup CliftonStrengths. Член ассоциации бизнес-тренеров.'
              },
              {
                img: ekaterinaImg,
                imgPos: '50% 0%',
                role: 'Коуч-сессии на тарифе «Архитектор»',
                name: 'Екатерина Туркевич',
                position: 'CEO · Co-founder',
                bio: 'Более 15 лет создаёт среду для развития людей, разрабатывает и проводит тренинги по всему миру. Работает с руководителями и командами над применением сильных сторон в реальных задачах.'
              }
            ].map((person, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
                  <img
                    src={person.img}
                    alt={person.name}
                    style={{ objectPosition: person.imgPos }}
                    className="w-full h-full object-cover grayscale brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/30 to-transparent" />
                  <span className="absolute top-5 left-5 px-4 py-2 bg-brand-yellow text-brand-dark rounded-full text-[10px] font-black uppercase tracking-widest max-w-[85%]">
                    {person.role}
                  </span>
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <p className="text-brand-accent font-black uppercase text-[10px] tracking-[0.25em] mb-2">
                    {person.position}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-5">
                    {person.name}
                  </h3>
                  <p className="text-blue-100/70 font-medium leading-relaxed flex-grow">
                    {person.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Тарифы */}
      <section id="tariffs" className="py-16 md:py-28 bg-brand-light scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-brand-dark mb-4">
            Выберите <span className="text-brand-accent not-italic">глубину</span>
          </h2>
          <div className="h-1.5 w-24 bg-brand-yellow mb-12" />

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8 items-start">
            {TARIFFS.map((t) => (
              <div
                key={t.key}
                className={`relative rounded-[2rem] p-8 md:p-10 flex flex-col h-full border ${
                  t.dark
                    ? 'bg-brand-dark text-white border-brand-dark shadow-2xl lg:-mt-4 lg:mb-4'
                    : 'bg-white text-brand-dark border-gray-200'
                }`}
              >
                {t.badge && (
                  <span className="absolute -top-3 left-8 px-4 py-1.5 bg-brand-yellow text-brand-dark rounded-full text-[10px] font-black uppercase tracking-widest">
                    {t.badge}
                  </span>
                )}

                <h3 className={`text-2xl lg:text-xl xl:text-2xl font-black uppercase italic tracking-tighter mb-2 ${t.dark ? 'text-white' : 'text-brand-dark'}`}>
                  {t.name}
                </h3>
                <p className={`text-4xl font-black italic mb-5 ${t.dark ? 'text-brand-yellow' : 'text-brand-accent'}`}>
                  {t.price}
                </p>
                <p className={`font-medium leading-relaxed mb-7 ${t.dark ? 'text-blue-100/70' : 'text-gray-600'}`}>
                  {t.tagline}
                </p>

                <ul className="space-y-3 mb-7 flex-grow">
                  {t.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className={`shrink-0 mt-0.5 ${t.dark ? 'text-brand-yellow' : 'text-brand-accent'}`} />
                      <span className={`text-sm font-medium leading-relaxed ${t.dark ? 'text-white/90' : 'text-gray-700'}`}>{p}</span>
                    </li>
                  ))}
                </ul>

                {t.note && (
                  <p className={`text-xs font-bold leading-relaxed mb-6 ${t.dark ? 'text-white/40' : 'text-gray-400'}`}>
                    {t.note}
                  </p>
                )}

                <button
                  onClick={() => handleTariffClick(t)}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${
                    t.dark ? 'bg-brand-yellow text-brand-dark' : 'bg-brand-dark text-white'
                  }`}
                >
                  {PROGRAM_CHECKOUT[t.key] ? 'Оплатить' : 'Оставить заявку'} <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallup */}
      <section className="py-16 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-brand-dark mb-4">
            Не наше мнение, <span className="text-brand-accent not-italic">а полвека исследований</span>
          </h2>
          <div className="h-1.5 w-24 bg-brand-yellow mb-12" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            {[
              { v: '50+', d: 'лет исследований' },
              { v: '30 млн+', d: 'человек прошли тест' },
              { v: '50+', d: 'стран' },
              { v: '34', d: 'темы талантов' }
            ].map((s, i) => (
              <div key={i} className="bg-brand-light rounded-[1.5rem] p-4 sm:p-6 lg:p-8 text-center">
                <p className="text-3xl md:text-4xl font-black italic text-brand-accent mb-2">{s.v}</p>
                <p className="text-xs font-bold uppercase tracking-wide lg:tracking-widest text-gray-500">{s.d}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="border-l-4 border-brand-yellow pl-6">
                <p className="text-2xl md:text-3xl font-black italic text-brand-dark mb-2">{s.value}</p>
                <p className="text-gray-600 font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-gray-400 font-medium">Источник: исследования института Gallup.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-28 bg-brand-light">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-brand-dark mb-4">
            Вопросы
          </h2>
          <div className="h-1.5 w-24 bg-brand-yellow mb-10" />
          <Accordion
            items={FAQ}
            renderTitle={(f) => (
              <h3 className="text-sm min-[360px]:text-base md:text-lg font-black uppercase italic tracking-tight text-brand-dark leading-tight pr-2">
                {f.q}
              </h3>
            )}
            renderBody={(f) => <p className="text-gray-600 font-medium leading-relaxed">{f.a}</p>}
          />
        </div>
      </section>

      {/* Финальный призыв и форма */}
      <section id="program-form" className="py-16 md:py-28 bg-white px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto relative overflow-hidden bg-brand-dark rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 text-white">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-accent/10 -skew-x-12 translate-x-1/4 pointer-events-none" />

          <div className="relative z-10 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-[0.95] mb-6">
                Старт <span className="text-brand-accent not-italic">скоро</span>
              </h2>
              <p className="text-base md:text-lg text-blue-100/70 font-medium leading-relaxed mb-6">
                Восемь суббот, которые изменят то, как вы смотрите на себя и свою работу.
                Даты нового потока объявим совсем скоро.
              </p>
              <p className="text-sm font-bold uppercase tracking-widest text-brand-yellow">
                Оставьте заявку — сообщим дату старта и пришлём условия
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10">
              {status === 'sent' ? (
                <div className="text-center py-6">
                  <CheckCircle2 size={44} className="text-brand-yellow mx-auto mb-4" />
                  <p className="text-lg font-black uppercase italic text-brand-yellow mb-3">Заявка отправлена</p>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Мы свяжемся с вами в течение рабочего дня и сообщим дату старта.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <select
                    value={form.tariff}
                    onChange={(e) => setForm({ ...form, tariff: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-brand-yellow transition-colors"
                  >
                    {TARIFFS.map((t) => (
                      <option key={t.key} value={t.name} className="bg-brand-dark">
                        {t.name}, {t.price}
                      </option>
                    ))}
                  </select>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ваше имя"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-yellow transition-colors"
                  />
                  <input
                    required
                    type="text"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    placeholder="Email или телефон"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-yellow transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-4 md:py-5 bg-brand-yellow text-brand-dark rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-xl shadow-brand-yellow/10 flex items-center justify-center gap-3 disabled:opacity-60"
                  >
                    {status === 'sending' ? 'Отправляем...' : (<>Записаться в лист ожидания <ArrowRight size={18} /></>)}
                  </button>
                  {status === 'error' && (
                    <p className="text-center text-xs font-bold text-brand-orange">
                      Что-то пошло не так. Напишите нам в Telegram.
                    </p>
                  )}
                  <p className="text-center text-[10px] font-bold uppercase tracking-widest text-white/30 pt-1">
                    Нажимая на кнопку, вы соглашаетесь с{' '}
                    <button
                      type="button"
                      onClick={() => window.dispatchEvent(new CustomEvent('open-privacy'))}
                      className="text-white/60 underline hover:text-brand-yellow transition-colors"
                    >
                      политикой конфиденциальности
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
