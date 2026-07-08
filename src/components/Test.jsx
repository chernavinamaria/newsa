import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Send, Target } from 'lucide-react';
import { submitLead } from '../config';

// Test constructed from the official metaprograms test (Метапрограммы.docx)
// Each question has 6 options, multiple selection allowed.
// Each option maps to a specific pole of one metaprogram pair.
const questions = [
  {
    pair: 'motivation',
    text: 'Вы занимаетесь спортом (или если бы занимались) для того, чтобы:',
    options: [
      { key: 'a', label: 'Улучшить своё физическое состояние и самочувствие', pole: 'toward' },
      { key: 'b', label: 'Избежать травм и возможных проблем со здоровьем', pole: 'away' },
      { key: 'c', label: 'Добиться личного успеха', pole: 'toward' },
      { key: 'd', label: 'Сбросить лишний вес', pole: 'away' },
      { key: 'e', label: 'Наслаждаться окрестностями и обществом других людей', pole: 'toward' },
      { key: 'f', label: 'Забыть о стрессе на работе или избежать проблем', pole: 'away' }
    ]
  },
  {
    pair: 'motivation',
    text: 'Думая о смене работы, какие аспекты вы рассматриваете в первую очередь?',
    options: [
      { key: 'a', label: 'Работа, которую больше всего хотели бы найти', pole: 'toward' },
      { key: 'b', label: 'Ситуации и люди, которых вы хотели бы избежать', pole: 'away' },
      { key: 'c', label: 'Удовлетворение от занятия любимым делом', pole: 'toward' },
      { key: 'd', label: 'Разочарования на текущем месте, желание оставить их в прошлом', pole: 'away' },
      { key: 'e', label: 'То, чего вы не получили на текущем месте работы', pole: 'away' },
      { key: 'f', label: 'Работа, удовлетворяющая потребностям, и пути её достижения', pole: 'toward' }
    ]
  },
  {
    pair: 'motivation',
    text: 'О чём вы думаете при планировании отпуска?',
    options: [
      { key: 'a', label: 'О проблемах организации поездки, о вопросах, которые могут быть сложны', pole: 'away' },
      { key: 'b', label: 'Представляю себя на отдыхе, мысленно уже там', pole: 'toward' },
      { key: 'c', label: 'О том, как проведу отпуск', pole: 'toward' },
      { key: 'd', label: 'Вспоминаю все преимущества поездки', pole: 'toward' },
      { key: 'e', label: 'О проблемах, с которыми столкнулась в прошлые поездки', pole: 'away' },
      { key: 'f', label: 'Обо всём, что нужно сделать в первую очередь', pole: 'away' }
    ]
  },
  {
    pair: 'motivation',
    text: 'Подумайте о том, что вам предстоит сделать до конца месяца. О чём мысли?',
    options: [
      { key: 'a', label: 'О том, чего хочу достичь — и это вызывает удовлетворение', pole: 'toward' },
      { key: 'b', label: 'О том, как много работы ещё предстоит сделать', pole: 'away' },
      { key: 'c', label: 'О том, что откладывала и что нужно наконец завершить', pole: 'away' },
      { key: 'd', label: 'О том, к чему давно стремилась и чувствах при достижении цели', pole: 'toward' },
      { key: 'e', label: 'О положительных эмоциях от того, что планирую достичь', pole: 'toward' },
      { key: 'f', label: 'О проблемах, которые могут возникнуть', pole: 'away' }
    ]
  },

  {
    pair: 'relations',
    text: 'Планируете покупку (машина, дом, книга, одежда). Что вы делаете?',
    options: [
      { key: 'a', label: 'Ищу товар с такими же характеристиками, как у ранее купленных', pole: 'similarities' },
      { key: 'b', label: 'Анализирую товар — что в нём НЕ соответствует моим потребностям', pole: 'differences' },
      { key: 'c', label: 'Сравниваю с перечнем характеристик, которые должны быть', pole: 'similarities' },
      { key: 'd', label: 'Ищу что-то, что отличается от того, что уже есть', pole: 'differences' },
      { key: 'e', label: 'Сравниваю товар с аналогичными продуктами', pole: 'similarities' },
      { key: 'f', label: 'Хочу приобрести что-то уникальное', pole: 'differences' }
    ]
  },
  {
    pair: 'relations',
    text: 'Что характеризует вашу манеру вести беседу?',
    options: [
      { key: 'a', label: 'Мне нравится яростный обмен мнениями', pole: 'differences' },
      { key: 'b', label: 'Стараюсь найти общие темы', pole: 'similarities' },
      { key: 'c', label: 'Стремлюсь прийти к согласию', pole: 'similarities' },
      { key: 'd', label: 'Анализирую чужие убеждения, чтобы их опровергнуть', pole: 'differences' },
      { key: 'e', label: 'Использую фразу «Да, но…»', pole: 'differences' },
      { key: 'f', label: 'Как правило, общаюсь с людьми, разделяющими мои взгляды', pole: 'similarities' }
    ]
  },
  {
    pair: 'relations',
    text: 'Что вы думаете о себе в сравнении с коллегами?',
    options: [
      { key: 'a', label: 'Считаю себя не таким, как они', pole: 'differences' },
      { key: 'b', label: 'Могу сказать, что очень похож на других', pole: 'similarities' },
      { key: 'c', label: 'Кажется, я выделяюсь в толпе', pole: 'differences' },
      { key: 'd', label: 'Думаю, у меня с ними много общего', pole: 'similarities' },
      { key: 'e', label: 'Чувствую себя человеком «со странностями»', pole: 'differences' },
      { key: 'f', label: 'Обычно гармонично взаимодействую с коллегами', pole: 'similarities' }
    ]
  },

  {
    pair: 'reference',
    text: 'Что вам говорит о том, что вы хорошо выполнили работу?',
    options: [
      { key: 'a', label: 'Меня похвалили', pole: 'external' },
      { key: 'b', label: 'Так говорят люди', pole: 'external' },
      { key: 'c', label: 'Я чувствую удовлетворённость', pole: 'internal' },
      { key: 'd', label: 'Знаю, что выполнил в соответствии со своими стандартами качества', pole: 'internal' },
      { key: 'e', label: 'Я пожинаю плоды успеха', pole: 'external' },
      { key: 'f', label: 'Просто знаю это', pole: 'internal' }
    ]
  },
  {
    pair: 'reference',
    text: 'Что вам говорит о том, что вы приятно проводите время?',
    options: [
      { key: 'a', label: 'Люди вокруг меня чувствуют себя счастливыми', pole: 'external' },
      { key: 'b', label: 'Я чувствую себя счастливым', pole: 'internal' },
      { key: 'c', label: 'У меня есть своё пространство и время на себя', pole: 'internal' },
      { key: 'd', label: 'Окружающим нравится то, что происходит вокруг', pole: 'external' },
      { key: 'e', label: 'Мне нравится, как я влияю на события вокруг', pole: 'external' },
      { key: 'f', label: 'Меня переполняют приятные чувства', pole: 'internal' }
    ]
  },
  {
    pair: 'reference',
    text: 'Что вам говорит о том, что вы приняли правильное решение?',
    options: [
      { key: 'a', label: 'Я просто знаю это', pole: 'internal' },
      { key: 'b', label: 'Другие это подтверждают', pole: 'external' },
      { key: 'c', label: 'Другие согласны со мной и уверяют меня в этом', pole: 'external' },
      { key: 'd', label: 'Я интуитивно чувствую, что это так', pole: 'internal' },
      { key: 'e', label: 'У меня возникает приятное чувство', pole: 'internal' },
      { key: 'f', label: 'Моё решение устраивает других', pole: 'external' }
    ]
  },

  {
    pair: 'focus',
    text: 'Разрабатываете план для задачи. На что обращаете внимание?',
    options: [
      { key: 'a', label: 'Последовательность событий', pole: 'procedures' },
      { key: 'b', label: 'Различные варианты', pole: 'options' },
      { key: 'c', label: 'То, к чему это ведёт', pole: 'procedures' },
      { key: 'd', label: 'Возможности', pole: 'options' },
      { key: 'e', label: 'Во-первых, во-вторых…', pole: 'procedures' },
      { key: 'f', label: 'Потенциальные решения', pole: 'options' }
    ]
  },
  {
    pair: 'focus',
    text: 'Какие утверждения вам наиболее близки?',
    options: [
      { key: 'a', label: 'Не буду делать всё сразу — двигаюсь к цели поэтапно', pole: 'procedures' },
      { key: 'b', label: 'В проекте нужно учесть много других вопросов', pole: 'options' },
      { key: 'c', label: 'Использую варианты решения — люблю иметь возможность выбора', pole: 'options' },
      { key: 'd', label: 'Мне нужно обезопасить себя «на всех фронтах»', pole: 'options' },
      { key: 'e', label: 'Буду изучать этот вопрос постепенно', pole: 'procedures' },
      { key: 'f', label: 'Не люблю менять свои планы', pole: 'procedures' }
    ]
  }
];

const RESULTS = {
  toward: {
    title: 'К цели',
    description: 'Вы двигаетесь к желаемому. Знаете, чего хотите, и создаёте мотивацию из результата. Сильная сторона: чётко ставите цели и уверенно идёте. Точка роста: можете не замечать угрозы и риски.',
    color: 'text-brand-accent',
    bg: 'bg-brand-accent/10'
  },
  away: {
    title: 'От проблемы',
    description: 'Вы мотивируетесь избеганием неприятностей — быстро видите риски и подводные камни. Сильная сторона: критическое мышление, защита от ошибок. Точка роста: сложно ставить позитивные цели без страха.',
    color: 'text-brand-yellow',
    bg: 'bg-brand-yellow/10'
  },
  similarities: {
    title: 'Сходства',
    description: 'Вы строите на знакомом — легко находите аналогии, цените стабильность и проверенный опыт. Сильная сторона: связь нового и старого. Точка роста: сопротивление радикальным изменениям.',
    color: 'text-brand-accent',
    bg: 'bg-brand-accent/10'
  },
  differences: {
    title: 'Различия',
    description: 'Вы видите уникальное в каждой ситуации — тянет к переменам и инновациям. Сильная сторона: способность к переизобретению и креативным решениям. Точка роста: тяжело удерживать рутину.',
    color: 'text-brand-yellow',
    bg: 'bg-brand-yellow/10'
  },
  internal: {
    title: 'Внутренняя референция',
    description: 'Вы оцениваете себя по своим стандартам — независимы от мнений. Сильная сторона: устойчивость, свои принципы, независимость. Точка роста: сложно принимать обратную связь.',
    color: 'text-brand-accent',
    bg: 'bg-brand-accent/10'
  },
  external: {
    title: 'Внешняя референция',
    description: 'Вы ориентированы на реакцию окружающих — чутки к контексту и людям. Сильная сторона: тонкая настройка на команду. Точка роста: можете потерять свой голос в чужих ожиданиях.',
    color: 'text-brand-yellow',
    bg: 'bg-brand-yellow/10'
  },
  procedures: {
    title: 'Процедуры',
    description: 'Вы предпочитаете отработанные пути — надёжно и предсказуемо. Сильная сторона: следование лучшим практикам, качество исполнения. Точка роста: тяжело в неопределённости и хаосе.',
    color: 'text-brand-accent',
    bg: 'bg-brand-accent/10'
  },
  options: {
    title: 'Варианты',
    description: 'Вы ищете новые способы — тянет к экспериментам и свободе выбора. Сильная сторона: креативность, гибкость, множество путей. Точка роста: трудно закончить начатое и следовать инструкции.',
    color: 'text-brand-yellow',
    bg: 'bg-brand-yellow/10'
  }
};

const PAIR_TITLES = {
  motivation: 'Направление мотивации',
  relations: 'Взаимосвязи',
  reference: 'Референция',
  focus: 'Центр внимания'
};

export default function Test({ isOpen, onClose }) {
  const [step, setStep] = useState('intro');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});
  const [contact, setContact] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent('modal-open'));
    } else {
      window.dispatchEvent(new CustomEvent('modal-close'));
    }
    return () => window.dispatchEvent(new CustomEvent('modal-close'));
  }, [isOpen]);

  const reset = () => {
    setStep('intro');
    setCurrent(0);
    setSelected({});
    setContact({ name: '', email: '' });
    setSubmitting(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const toggle = (pole) => {
    const cur = selected[current] || [];
    const next = cur.includes(pole)
      ? cur.filter((_, i) => i !== cur.indexOf(pole))
      : [...cur, pole];
    setSelected({ ...selected, [current]: next });
  };

  const toggleOption = (optionIdx) => {
    const cur = selected[current] || [];
    const nextIndices = cur.includes(optionIdx)
      ? cur.filter(i => i !== optionIdx)
      : [...cur, optionIdx];
    setSelected({ ...selected, [current]: nextIndices });
  };

  const isSelected = (optionIdx) => (selected[current] || []).includes(optionIdx);

  const canNext = (selected[current] || []).length > 0;

  const next = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setStep('form');
    }
  };

  const back = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const computeResults = () => {
    const pairs = Object.keys(PAIR_TITLES);
    return pairs.map(pair => {
      const poleCounts = {};
      questions.forEach((q, qIdx) => {
        if (q.pair !== pair) return;
        const chosen = selected[qIdx] || [];
        chosen.forEach(optIdx => {
          const pole = q.options[optIdx].pole;
          poleCounts[pole] = (poleCounts[pole] || 0) + 1;
        });
      });
      const sorted = Object.entries(poleCounts).sort((a, b) => b[1] - a[1]);
      const dominantPole = sorted[0]?.[0];
      const total = sorted.reduce((s, [, v]) => s + v, 0);
      const dominantCount = sorted[0]?.[1] || 0;
      return {
        pair,
        pole: dominantPole,
        counts: poleCounts,
        strength: total > 0 ? Math.round((dominantCount / total) * 100) : 0
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const results = computeResults();
    const payload = {
      form: 'metaprograms-test',
      name: contact.name,
      email: contact.email,
      results,
      ts: new Date().toISOString()
    };
    try {
      // 1. Save to CRM (Google Sheet) + Telegram
      await submitLead({
        type: 'тест метапрограмм',
        name: contact.name,
        contact: contact.email,
        source: 'форма тест',
        metaprograms: results,
        notes: 'Прошёл тест метапрограмм на сайте'
      });
      // 2. Send extended email report via Resend
      await fetch('https://sa-api-backend.netlify.app/.netlify/functions/send-test-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: contact.name, email: contact.email, results })
      }).catch(() => {});
    } catch {}
    setSubmitting(false);
    setStep('results');
  };

  const results = step === 'results' ? computeResults() : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-0 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-brand-dark/95 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            className="relative w-full h-full md:max-w-3xl md:max-h-[92vh] bg-white md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-3 bg-brand-light hover:bg-gray-200 rounded-full z-[180] transition-colors text-brand-dark"
            >
              <X size={22} />
            </button>

            {step === 'intro' && (
              <div className="flex-grow overflow-y-auto p-5 md:p-14 flex flex-col text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-yellow rounded-2xl flex items-center justify-center text-brand-dark mx-auto mb-4 md:mb-6 shadow-lg">
                  <Sparkles size={24} className="md:hidden" />
                  <Sparkles size={32} className="hidden md:block" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent mb-2 md:mb-3">Бесплатно · 7 минут</p>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-brand-dark mb-3 md:mb-4">
                  Тест <span className="text-brand-accent not-italic">«Метапрограммы»</span>
                </h2>
                <div className="max-w-xl mx-auto mb-5 md:mb-8 text-left">
                  <p className="text-sm md:text-lg text-gray-700 font-medium leading-relaxed mb-3">
                    Одну задачу вы решаете за час, а коллега — за неделю? Или наоборот? Дело не в уме. Мозги <b>по-разному фильтруют реальность</b>.
                  </p>
                  <p className="text-sm md:text-lg text-gray-700 font-medium leading-relaxed mb-3">
                    Кто-то видит цель — бежит. Кто-то риски — планирует. Это и есть <b>метапрограммы</b>: настройки мышления, которые определяют <b>как</b> вы принимаете решения.
                  </p>
                  <p className="text-sm md:text-lg text-gray-700 font-medium leading-relaxed">
                    Тест покажет ваш профиль за 7 минут. Поймёте, где ваша сила, а где — грабли, на которые всё время наступаете.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 md:gap-4 mb-5 md:mb-10 max-w-xl mx-auto">
                  {[
                    { n: '12', t: 'Вопросов' },
                    { n: '4', t: 'Метапрограммы' },
                    { n: '~7', t: 'Минут' }
                  ].map((s, i) => (
                    <div key={i} className="p-3 md:p-4 bg-brand-light rounded-xl md:rounded-2xl">
                      <div className="text-xl md:text-3xl font-black italic text-brand-dark">{s.n}</div>
                      <div className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">{s.t}</div>
                    </div>
                  ))}
                </div>
                <div className="max-w-md mx-auto mb-5 md:mb-8 p-3 md:p-4 bg-brand-yellow/10 rounded-xl md:rounded-2xl border border-brand-yellow/30">
                  <p className="text-xs md:text-sm text-brand-dark font-medium">
                    💡 В каждом вопросе можно отметить <b>несколько ответов</b>
                  </p>
                </div>
                <button
                  onClick={() => setStep('quiz')}
                  className="mx-auto px-8 md:px-10 py-4 md:py-5 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest hover:bg-brand-accent transition-all shadow-xl flex items-center gap-3 text-sm md:text-base"
                >
                  Начать тест <ArrowRight size={18} />
                </button>
              </div>
            )}

            {step === 'quiz' && (
              <div className="flex-grow overflow-y-auto p-6 md:p-14 flex flex-col">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/60">
                      Вопрос {current + 1} из {questions.length}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">
                      {PAIR_TITLES[questions[current].pair]}
                    </span>
                  </div>
                  <div className="h-2 bg-brand-light rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-brand-yellow"
                      initial={{ width: 0 }}
                      animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-grow flex flex-col"
                >
                  <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-brand-dark leading-tight mb-6 md:mb-8">
                    {questions[current].text}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Отметьте всё, что вам близко</p>

                  <div className="grid gap-3 mb-6">
                    {questions[current].options.map((opt, optIdx) => {
                      const active = isSelected(optIdx);
                      return (
                        <button
                          key={opt.key}
                          onClick={() => toggleOption(optIdx)}
                          className={`text-left p-4 md:p-5 rounded-2xl transition-all group border-2 ${
                            active
                              ? 'bg-brand-yellow/30 border-brand-yellow'
                              : 'bg-brand-light border-transparent hover:border-brand-yellow/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-6 h-6 shrink-0 rounded-md border-2 flex items-center justify-center transition-all ${
                              active
                                ? 'bg-brand-yellow border-brand-yellow'
                                : 'bg-white border-gray-300'
                            }`}>
                              {active && <CheckCircle2 size={14} className="text-brand-dark" fill="currentColor" />}
                            </div>
                            <p className="text-sm md:text-base text-brand-dark font-medium leading-relaxed">
                              {opt.label}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                <div className="pt-4 flex items-center justify-between gap-4">
                  <button
                    onClick={back}
                    disabled={current === 0}
                    className="flex items-center gap-2 px-4 py-3 text-brand-dark/60 hover:text-brand-dark disabled:opacity-30 disabled:cursor-not-allowed text-xs font-black uppercase tracking-widest transition-colors"
                  >
                    <ArrowLeft size={14} /> Назад
                  </button>
                  <button
                    onClick={next}
                    disabled={!canNext}
                    className="flex items-center gap-2 px-8 py-4 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm hover:bg-brand-accent transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {current + 1 === questions.length ? 'Завершить' : 'Далее'} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {step === 'form' && (
              <div className="flex-grow overflow-y-auto p-6 md:p-14 flex flex-col justify-center">
                <div className="max-w-lg mx-auto w-full text-center">
                  <div className="w-14 h-14 bg-brand-yellow/20 rounded-2xl flex items-center justify-center text-brand-dark mx-auto mb-5">
                    <CheckCircle2 size={28} className="text-brand-accent" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent mb-3">Тест пройден</p>
                  <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-brand-dark mb-4">
                    Куда прислать <span className="text-brand-accent not-italic">разбор?</span>
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed mb-8">
                    Оставьте контакты — покажем результат прямо здесь, а расширенный разбор с рекомендациями коуча пришлём на email.
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    name="metaprograms-test"
                    data-netlify="true"
                    className="space-y-3 text-left"
                  >
                    <input type="hidden" name="form-name" value="metaprograms-test" />
                    <input
                      required
                      type="text"
                      name="name"
                      placeholder="Как к вам обращаться?"
                      value={contact.name}
                      onChange={e => setContact({ ...contact, name: e.target.value })}
                      className="w-full bg-brand-light border-2 border-transparent focus:border-brand-yellow rounded-2xl px-5 py-4 text-brand-dark placeholder:text-gray-400 focus:outline-none transition-colors"
                    />
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="Email для расширенного разбора"
                      value={contact.email}
                      onChange={e => setContact({ ...contact, email: e.target.value })}
                      className="w-full bg-brand-light border-2 border-transparent focus:border-brand-yellow rounded-2xl px-5 py-4 text-brand-dark placeholder:text-gray-400 focus:outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest hover:bg-brand-accent transition-all shadow-xl flex items-center justify-center gap-3 text-sm disabled:opacity-60"
                    >
                      {submitting ? 'Отправляем...' : (<>Показать разбор <Send size={16} /></>)}
                    </button>
                    <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 pt-2">
                      Ваши данные — только у команды Strengths Academy.{' '}
                      <button
                        type="button"
                        onClick={() => window.dispatchEvent(new CustomEvent('open-privacy'))}
                        className="underline hover:text-brand-accent transition-colors"
                      >
                        Политика
                      </button>
                    </p>
                  </form>
                </div>
              </div>
            )}

            {step === 'results' && (
              <div className="flex-grow overflow-y-auto p-6 md:p-14">
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent mb-3">Ваш профиль</p>
                    <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-brand-dark mb-4">
                      Разбор <span className="text-brand-accent not-italic">метапрограмм</span>
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 font-medium">
                      Расширенный отчёт с рекомендациями от коуча — придёт на {contact.email}.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {results.map((r, i) => {
                      const res = RESULTS[r.pole];
                      if (!res) return null;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.15 }}
                          className={`p-5 md:p-6 rounded-2xl border border-gray-100 ${res.bg}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/50">
                              {PAIR_TITLES[r.pair]}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/60">
                              {r.strength}% выражено
                            </span>
                          </div>
                          <h4 className={`text-xl md:text-2xl font-black uppercase italic tracking-tighter mb-2 ${res.color}`}>
                            {res.title}
                          </h4>
                          <p className="text-sm md:text-base text-gray-700 font-medium leading-relaxed">
                            {res.description}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Value bridge: metaprograms → CliftonStrengths */}
                  <div className="mt-10 p-6 md:p-10 bg-gradient-to-br from-brand-dark to-brand-accent rounded-[2rem] md:rounded-[2.5rem] text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/10 rounded-full blur-[80px] -translate-y-1/3 translate-x-1/4 pointer-events-none"></div>

                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-yellow mb-4">Что дальше</p>
                      <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-tight mb-6">
                        Метапрограммы — это только <span className="text-brand-yellow not-italic">половина</span> вашей формулы успеха
                      </h3>

                      <div className="grid sm:grid-cols-2 gap-4 mb-8">
                        <div className="p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                          <div className="text-[10px] font-black uppercase tracking-widest text-brand-yellow mb-2">Метапрограммы</div>
                          <div className="text-2xl font-black italic mb-2">КАК</div>
                          <p className="text-sm text-white/80">вы фильтруете информацию, принимаете решения и действуете</p>
                        </div>
                        <div className="p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                          <div className="text-[10px] font-black uppercase tracking-widest text-brand-yellow mb-2">Таланты Gallup</div>
                          <div className="text-2xl font-black italic mb-2">ЧТО</div>
                          <p className="text-sm text-white/80">вы делаете естественно лучше остальных — ваши сильные стороны</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-6 text-brand-yellow">
                        <div className="h-px flex-grow bg-brand-yellow/30"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">+</span>
                        <div className="h-px flex-grow bg-brand-yellow/30"></div>
                      </div>

                      <p className="text-base md:text-lg font-medium text-white/90 leading-relaxed mb-8">
                        Вместе они — ваша <b className="text-brand-yellow">формула успеха</b>. Один и тот же талант работает по-разному у человека с мотивацией «к цели» и «от проблемы». Знать оба слоя = принимать решения из своей силы, а не из чужих сценариев.
                      </p>

                      <div className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-2xl p-5 md:p-6 mb-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-brand-yellow rounded-xl flex items-center justify-center text-brand-dark shrink-0">
                            <Target size={22} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-yellow mb-1">Следующий шаг</p>
                            <h4 className="text-lg md:text-xl font-black uppercase italic tracking-tight leading-tight mb-2">
                              Тест CliftonStrengths 34 + разбор с коучем
                            </h4>
                            <p className="text-sm text-white/80 leading-relaxed">
                              177 вопросов от Gallup → ваш полный отчёт по 34 талантам с топ-5 + сессия 1,5 часа: как применять их с вашим типом мышления.
                            </p>
                          </div>
                        </div>
                      </div>

                      <a
                        href="#cta"
                        onClick={handleClose}
                        className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-brand-yellow text-brand-dark rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-transform text-xs md:text-sm shadow-2xl"
                      >
                        Узнать мои ТОП-5 талантов <ArrowRight size={16} />
                      </a>
                      <p className="text-center text-[10px] font-bold uppercase tracking-widest text-white/40 mt-3">
                        от 10 000 ₽ · Тест + отчёт · От 50 000 ₽ · С сессией коуча
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
