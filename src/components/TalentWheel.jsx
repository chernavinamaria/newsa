import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, ArrowRight } from 'lucide-react';

const domains = [
  {
    key: 'executing',
    label: 'Достижение',
    labelEn: 'Executing',
    color: '#fff1ad',
    textColor: '#004452',
    talents: [
      { name: 'Achiever', ru: 'Достижение', desc: 'Обладают огромной внутренней жаждой действия. Много работают и получают удовольствие от того, что заняты и продуктивны.' },
      { name: 'Arranger', ru: 'Организатор', desc: 'Умеют организовывать людей и ресурсы, находя наилучшую конфигурацию для решения задачи.' },
      { name: 'Belief', ru: 'Вера', desc: 'Обладают устойчивыми ключевыми ценностями. Из них выводят чёткий смысл своей жизни.' },
      { name: 'Consistency', ru: 'Последовательность', desc: 'Осознают важность равенства. Ищут способы обращаться со всеми одинаково через ясные процедуры.' },
      { name: 'Deliberative', ru: 'Осмотрительность', desc: 'Тщательно принимают решения. Умеют предвидеть препятствия.' },
      { name: 'Discipline', ru: 'Дисциплина', desc: 'Наслаждаются рутиной и структурой. Их мир упорядочен планами.' },
      { name: 'Focus', ru: 'Фокус', desc: 'Умеют выбрать направление, следовать ему и вносить коррективы, чтобы оставаться на курсе.' },
      { name: 'Responsibility', ru: 'Ответственность', desc: 'Психологически берут на себя обязательство за сказанное. Ценят честность и лояльность.' },
      { name: 'Restorative', ru: 'Исправление', desc: 'Умеют работать с проблемами — выявляют их и находят решения.' }
    ]
  },
  {
    key: 'influencing',
    label: 'Влияние',
    labelEn: 'Influencing',
    color: '#AECD65',
    textColor: '#004452',
    talents: [
      { name: 'Activator', ru: 'Активатор', desc: 'Превращают мысли в действия. Хотят действовать прямо сейчас, а не ждать.' },
      { name: 'Command', ru: 'Командование', desc: 'Обладают присутствием лидера. Умеют брать контроль над ситуацией и принимать решения.' },
      { name: 'Communication', ru: 'Коммуникация', desc: 'Легко выражают мысли словами. Хорошие собеседники и презентаторы.' },
      { name: 'Competition', ru: 'Соревнование', desc: 'Измеряют прогресс сравнением с другими. Стремятся к первому месту, удовлетворяются победами.' },
      { name: 'Maximizer', ru: 'Максимизатор', desc: 'Фокусируются на сильных сторонах, чтобы вести себя и других к превосходству.' },
      { name: 'Self-Assurance', ru: 'Уверенность в себе', desc: 'Уверены в способности управлять своей жизнью. Внутренний компас даёт уверенность в решениях.' },
      { name: 'Significance', ru: 'Значимость', desc: 'Хотят быть важными в глазах других. Независимы и стремятся к признанию.' },
      { name: 'Woo', ru: 'Расположение', desc: 'Любят вызов знакомства с новыми людьми и умение расположить их к себе.' }
    ]
  },
  {
    key: 'relationship',
    label: 'Отношения',
    labelEn: 'Relationship',
    color: '#0a9396',
    textColor: '#ffffff',
    talents: [
      { name: 'Adaptability', ru: 'Гибкость', desc: 'Живут настоящим моментом. Воспринимают будущее как то, что создают своими решениями сегодня.' },
      { name: 'Connectedness', ru: 'Связь', desc: 'Верят в связь всего сущего. Мало верят в совпадения — во всём есть смысл.' },
      { name: 'Developer', ru: 'Развитие других', desc: 'Распознают потенциал в других. Замечают признаки роста и находят удовольствие в этом.' },
      { name: 'Empathy', ru: 'Эмпатия', desc: 'Чувствуют эмоции других, воображая себя в их жизни и ситуации.' },
      { name: 'Harmony', ru: 'Гармония', desc: 'Ищут согласия. Не любят конфликты, скорее ищут точки соприкосновения.' },
      { name: 'Includer', ru: 'Включение', desc: 'Принимают других. Замечают тех, кто в стороне, и стараются вовлечь их.' },
      { name: 'Individualization', ru: 'Индивидуализация', desc: 'Захвачены уникальными качествами каждого человека.' },
      { name: 'Positivity', ru: 'Позитив', desc: 'Обладают заразительным энтузиазмом. Наделяют других энергией.' },
      { name: 'Relator', ru: 'Близкие отношения', desc: 'Наслаждаются близкими отношениями. Находят удовольствие в совместной работе для достижения цели.' }
    ]
  },
  {
    key: 'strategic',
    label: 'Стратегия',
    labelEn: 'Strategic',
    color: '#004452',
    textColor: '#ffffff',
    talents: [
      { name: 'Analytical', ru: 'Аналитик', desc: 'Ищут причины и следствия. Умеют думать обо всех факторах, влияющих на ситуацию.' },
      { name: 'Context', ru: 'Контекст', desc: 'Наслаждаются размышлениями о прошлом. Понимают настоящее, исследуя его историю.' },
      { name: 'Futuristic', ru: 'Футурист', desc: 'Вдохновляются будущим. Своим видением того, что может быть, вдохновляют других.' },
      { name: 'Ideation', ru: 'Идеи', desc: 'Заворожены идеями. Умеют находить связи между кажущимися разными явлениями.' },
      { name: 'Input', ru: 'Собирательство', desc: 'Тянутся к сбору информации. Могут собирать факты, слова, книги или цитаты.' },
      { name: 'Intellection', ru: 'Интеллект', desc: 'Характеризуются интеллектуальной активностью. Погружены в размышления.' },
      { name: 'Learner', ru: 'Учение', desc: 'Обладают сильным желанием учиться и постоянно совершенствоваться.' },
      { name: 'Strategic', ru: 'Стратег', desc: 'Создают альтернативные пути движения. Быстро замечают паттерны и находят решения.' }
    ]
  }
];

export default function TalentWheel() {
  const [spinning, setSpinning] = useState(false);
  const [revealed, setRevealed] = useState(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Notify FloatingCTA to hide while mobile drawer is visible
    if (revealed && window.matchMedia('(max-width: 1023px)').matches) {
      window.dispatchEvent(new CustomEvent('modal-open'));
    } else {
      window.dispatchEvent(new CustomEvent('modal-close'));
    }
  }, [revealed]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setRevealed(null);

    const domainIdx = Math.floor(Math.random() * 4);
    const talentIdx = Math.floor(Math.random() * domains[domainIdx].talents.length);

    // Each slice = 90°. Slice i center = i*90 + 45 (measuring clockwise from top).
    // Pointer is at top. Wheel rotates clockwise. To land pointer on slice i center,
    // total rotation must be N*360 - (i*90 + 45), so that slice i center comes to top.
    const currentMod = ((rotation % 360) + 360) % 360;
    const targetMod = (360 - (domainIdx * 90 + 45)) % 360;
    let delta = targetMod - currentMod;
    if (delta <= 0) delta += 360;
    const finalRotation = rotation + 360 * 6 + delta;
    setRotation(finalRotation);

    setTimeout(() => {
      setRevealed({
        domain: domains[domainIdx],
        talent: domains[domainIdx].talents[talentIdx]
      });
      setSpinning(false);
    }, 3800);
  };

  return (
    <section id="wheel" className="py-16 md:py-32 bg-gradient-to-b from-brand-light to-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow/20 rounded-full mb-4">
            <Sparkles size={14} className="text-brand-dark" />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark">Играем · Изучаем</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-brand-dark uppercase tracking-tighter italic mb-4">
            Колесо <span className="text-brand-accent not-italic">талантов</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 font-medium max-w-xl mx-auto">
            Крутните — выпадет одна из 4 сфер и случайный талант из неё. Всего в методике Gallup — 34 таланта.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,1fr] gap-10 lg:gap-16 items-center">
          {/* Wheel */}
          <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[400px] md:max-w-[460px] aspect-square">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20">
              <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[26px] border-t-brand-dark drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"></div>
            </div>

            <motion.div
              className="w-full h-full relative rounded-full shadow-2xl overflow-hidden border-[10px] border-white ring-4 ring-brand-dark/10"
              animate={{ rotate: rotation }}
              transition={{ duration: 3.8, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ transformOrigin: 'center' }}
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {domains.map((d, i) => {
                  // Slice i covers angles: i*90 to (i+1)*90 measuring clockwise from top (12 o'clock).
                  // In SVG math (0 = 3 o'clock, 90 = 6 o'clock), that's angle_svg = clockwise_from_top - 90.
                  const startClockwiseFromTop = i * 90;
                  const endClockwiseFromTop = (i + 1) * 90;
                  const startAngle = (startClockwiseFromTop - 90) * (Math.PI / 180);
                  const endAngle = (endClockwiseFromTop - 90) * (Math.PI / 180);
                  const x1 = 100 + 100 * Math.cos(startAngle);
                  const y1 = 100 + 100 * Math.sin(startAngle);
                  const x2 = 100 + 100 * Math.cos(endAngle);
                  const y2 = 100 + 100 * Math.sin(endAngle);
                  const path = `M 100,100 L ${x1},${y1} A 100,100 0 0 1 ${x2},${y2} Z`;

                  return (
                    <g key={d.key}>
                      <path d={path} fill={d.color} stroke="white" strokeWidth="1.5" />
                    </g>
                  );
                })}
                {/* Divider lines - white spokes */}
                {[0, 1, 2, 3].map(i => {
                  const angle = (i * 90 - 90) * (Math.PI / 180);
                  return (
                    <line
                      key={i}
                      x1="100"
                      y1="100"
                      x2={100 + 100 * Math.cos(angle)}
                      y2={100 + 100 * Math.sin(angle)}
                      stroke="white"
                      strokeWidth="2"
                    />
                  );
                })}
                {/* Domain labels — rotate with wheel, upright at rest */}
                {domains.map((d, i) => {
                  const centerAngleDeg = i * 90 + 45;  // clockwise from top
                  const svgAngle = (centerAngleDeg - 90) * (Math.PI / 180);
                  const r = 62;
                  const cx = 100 + r * Math.cos(svgAngle);
                  const cy = 100 + r * Math.sin(svgAngle);
                  return (
                    <g key={d.key + '-label'}>
                      <text
                        x={cx}
                        y={cy - 3}
                        fill={d.textColor}
                        fontSize="8"
                        fontWeight="900"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
                      >
                        {d.label}
                      </text>
                      <text
                        x={cx}
                        y={cy + 6}
                        fill={d.textColor}
                        fontSize="3.5"
                        fontWeight="700"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        opacity="0.6"
                        style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
                      >
                        {d.talents.length} талантов
                      </text>
                    </g>
                  );
                })}
                {/* Center hub */}
                <circle cx="100" cy="100" r="22" fill="#004452" />
                <circle cx="100" cy="100" r="19" fill="#fff1ad" />
                <text x="100" y="105" fill="#004452" fontSize="10" fontWeight="900" textAnchor="middle" dominantBaseline="middle">34</text>
              </svg>

            </motion.div>

            {/* Spin button */}
            <button
              onClick={spin}
              disabled={spinning}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 bg-brand-dark text-white rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs shadow-[0_10px_40px_rgba(0,0,0,0.4)] border-4 border-white hover:scale-110 transition-transform disabled:opacity-70 disabled:cursor-not-allowed z-30"
            >
              {spinning ? (
                <RefreshCw size={22} className="mx-auto animate-spin" />
              ) : (
                'Крутить'
              )}
            </button>
          </div>

          {/* Info panel — desktop */}
          <div className="hidden lg:block max-w-md w-full">
            <AnimatePresence mode="wait">
              {revealed ? (
                <motion.div
                  key={revealed.talent.name}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="p-8 rounded-[2rem] shadow-2xl"
                  style={{ backgroundColor: revealed.domain.color, color: revealed.domain.textColor }}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-3">
                    {revealed.domain.label} · {revealed.domain.labelEn}
                  </p>
                  <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-2">
                    {revealed.talent.name}
                  </h3>
                  <p className="text-xl font-black italic mb-4 opacity-80">
                    {revealed.talent.ru}
                  </p>
                  <p className="text-base font-medium leading-relaxed mb-6 opacity-95">
                    {revealed.talent.desc}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={spin}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-black/15 backdrop-blur-md border border-black/20 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-black/25 transition-colors"
                      style={{ color: revealed.domain.textColor }}
                    >
                      <RefreshCw size={12} /> Ещё
                    </button>
                    <a
                      href="#cta"
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-brand-dark text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-brand-accent transition-colors"
                    >
                      Найти свои <ArrowRight size={12} />
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-xl"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent mb-3">Как это работает</p>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter text-brand-dark leading-tight mb-4">4 сферы · 34 таланта</h3>
                  <p className="text-base text-gray-600 font-medium leading-relaxed mb-6">
                    Gallup разделил таланты на 4 сферы. Крутните — стрелка укажет на сферу, а из неё выпадет один талант.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {domains.map(d => (
                      <div key={d.key} className="px-3 py-3 rounded-2xl text-center flex flex-col items-center gap-1" style={{ backgroundColor: d.color, color: d.textColor }}>
                        <span className="text-sm font-black uppercase tracking-tight leading-none">{d.label}</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-70">{d.talents.length} талантов</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Domain legend — mobile only, before spin */}
          {!revealed && (
            <div className="lg:hidden grid grid-cols-2 gap-2 max-w-md mx-auto w-full">
              {domains.map(d => (
                <div key={d.key} className="px-3 py-3 rounded-2xl text-center flex flex-col items-center gap-1" style={{ backgroundColor: d.color, color: d.textColor }}>
                  <span className="text-xs font-black uppercase tracking-tight leading-none">{d.label}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest opacity-70">{d.talents.length} талантов</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom drawer */}
      <AnimatePresence>
        {revealed && (
          <div className="lg:hidden fixed inset-0 z-[190] pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRevealed(null)}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm pointer-events-auto"
            />
            <motion.div
              key={revealed.talent.name}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 rounded-t-[2.5rem] shadow-2xl p-6 pt-4 pointer-events-auto"
              style={{ backgroundColor: revealed.domain.color, color: revealed.domain.textColor }}
            >
              <div className="w-12 h-1.5 rounded-full mx-auto mb-4 opacity-30" style={{ backgroundColor: revealed.domain.textColor }}></div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-2">
                {revealed.domain.label} · {revealed.domain.labelEn}
              </p>
              <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-1">
                {revealed.talent.name}
              </h3>
              <p className="text-base font-black italic mb-3 opacity-80">
                {revealed.talent.ru}
              </p>
              <p className="text-sm font-medium leading-relaxed mb-5 opacity-95">
                {revealed.talent.desc}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={spin}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-black/15 backdrop-blur-md border border-black/20 rounded-full font-black uppercase tracking-widest text-[10px]"
                  style={{ color: revealed.domain.textColor }}
                >
                  <RefreshCw size={12} /> Ещё
                </button>
                <a
                  href="#cta"
                  onClick={() => setRevealed(null)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-dark text-white rounded-full font-black uppercase tracking-widest text-[10px]"
                >
                  Мои таланты <ArrowRight size={12} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
