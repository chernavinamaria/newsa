import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Sparkles, Users, User, CheckCircle2 } from 'lucide-react';
import { submitLead } from '../config';
import Honeypot, { trapValue } from './Honeypot';

const PATHS = {
  team: {
    eyebrow: 'Для бизнеса и себя',
    title: 'Готовы раскрыть сильные стороны?',
    sub: 'Оставьте заявку — свяжемся в течение рабочего дня, подберём удобное время встречи с коучем и обсудим формат под ваши задачи.',
    formTitle: 'Встреча с коучем',
    formMeta: '1,5 часа / Zoom · 50 000 ₽',
    benefits: [
      'Персональный action plan на 30/60/90 дней',
      'Разбор ваших талантов на реальных задачах',
      '3 месяца сопровождения в Telegram'
    ],
    cta: 'Отправить заявку'
  },
  self: {
    eyebrow: 'Для себя',
    title: 'Начните с бесплатного теста',
    sub: 'Узнайте свой профиль по метапрограммам — как вы принимаете решения и что замечаете первым.',
    formTitle: 'Тест «Метапрограммы»',
    formMeta: 'Бесплатно · 12 вопросов · 7 минут',
    benefits: [
      'Разбор ваших ключевых метапрограмм',
      'Понимание сильных сторон мышления',
      'Мост к тесту 34 талантов по Gallup'
    ],
    cta: 'Пройти бесплатный тест'
  }
};

export default function CTASection() {
  const [path, setPath] = useState('team');
  const [form, setForm] = useState({ name: '', contact: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const p = PATHS[path];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.contact) return;
    // Ловушка для ботов: делаем вид, что отправили, но никуда не шлём
    if (trapValue(e.currentTarget)) {
      setStatus('sent');
      setForm({ name: '', contact: '' });
      return;
    }
    setStatus('sending');
    const payload = {
      form: `contact-request-${path}`,
      name: form.name,
      contact: form.contact,
      path: path === 'team' ? 'B2B: команда' : 'B2C: для себя',
      ts: new Date().toISOString()
    };
    try {
      await submitLead({
        type: 'встреча с коучем',
        name: form.name,
        contact: form.contact,
        source: payload.path,
        notes: 'Форма «Записаться на встречу» на главной странице'
      });
      setStatus('sent');
      setForm({ name: '', contact: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="cta" className="py-12 md:py-24 bg-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto relative overflow-hidden bg-brand-dark rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 lg:p-20 text-white"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-accent/10 -skew-x-12 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col items-center text-center mb-10 md:mb-14">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-brand-yellow" size={20} />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-brand-yellow italic">Сделайте первый шаг</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.95] mb-6 max-w-3xl">
              Готовы раскрыть <br/> <span className="text-brand-accent not-italic">сильные стороны?</span>
            </h2>
            <p className="text-base md:text-lg text-blue-100/60 font-medium max-w-xl">
              Выберите подходящий путь — первый шаг бесплатный.
            </p>
          </div>

          {/* Path toggle */}
          <div className="flex justify-center mb-10 md:mb-12">
            <div className="inline-flex p-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
              <button
                onClick={() => setPath('team')}
                className={`flex items-center gap-2 px-5 md:px-7 py-3 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs transition-all ${
                  path === 'team' ? 'bg-brand-yellow text-brand-dark shadow-lg' : 'text-white/60 hover:text-white'
                }`}
              >
                <Users size={14} /> У меня команда
              </button>
              <button
                onClick={() => setPath('self')}
                className={`flex items-center gap-2 px-5 md:px-7 py-3 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs transition-all ${
                  path === 'self' ? 'bg-brand-yellow text-brand-dark shadow-lg' : 'text-white/60 hover:text-white'
                }`}
              >
                <User size={14} /> Для себя
              </button>
            </div>
          </div>

          <motion.div
            key={path}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-10 md:gap-16 items-center"
          >
            <div>
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-brand-yellow mb-4">{p.eyebrow}</span>
              <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-[0.95] mb-6">
                {p.title}
              </h3>
              <p className="text-base md:text-lg text-blue-100/70 font-medium leading-relaxed mb-8">
                {p.sub}
              </p>
              <ul className="space-y-3">
                {p.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-brand-yellow shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base text-white/90 font-medium">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                    path === 'team' ? 'bg-brand-accent/20 text-brand-accent' : 'bg-brand-yellow/20 text-brand-yellow'
                  }`}>
                    {path === 'team' ? <Target size={24} /> : <Sparkles size={24} />}
                  </div>
                  <div>
                    <h4 className="font-black uppercase italic text-base md:text-lg leading-none mb-1">{p.formTitle}</h4>
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">{p.formMeta}</p>
                  </div>
                </div>

                {path === 'self' ? (
                  <div className="space-y-4">
                    <p className="text-sm text-white/80 leading-relaxed">
                      Тест занимает 7 минут. По итогам покажем ваш профиль по 4 метапрограммам и подскажем следующий шаг — тест ТОП-5 талантов Gallup с разбором коуча.
                    </p>
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('open-test'))}
                      className="w-full py-4 md:py-5 bg-brand-yellow text-brand-dark rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-yellow/10 flex items-center justify-center gap-3"
                    >
                      {p.cta} <ArrowRight size={18} />
                    </button>
                    <p className="text-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                      Контакты оставите после прохождения теста
                    </p>
                  </div>
                ) : status === 'sent' ? (
                  <div className="text-center py-6">
                    <CheckCircle2 size={44} className="text-brand-yellow mx-auto mb-4" />
                    <p className="text-lg font-black uppercase italic text-brand-yellow mb-3">Заявка отправлена</p>
                    <p className="text-sm text-white/80 leading-relaxed mb-2">
                      Мы свяжемся с вами <b className="text-white">в течение рабочего дня</b> и подберём удобное время встречи с коучем.
                    </p>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Встреча — 1,5 часа онлайн. Стоимость: 50 000 ₽. По итогам — action plan на 30/60/90 дней и 3 месяца поддержки.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    name="contact-request"
                    data-netlify="true"
                    className="space-y-3"
                  >
                    <input type="hidden" name="form-name" value="contact-request" />
                    <input type="hidden" name="path" value="B2B: команда" />
                    <input
                      required
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Ваше имя"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-yellow transition-colors"
                    />
                    <input
                      required
                      type="text"
                      name="contact"
                      value={form.contact}
                      onChange={e => setForm({ ...form, contact: e.target.value })}
                      placeholder={path === 'team' ? 'Email или телефон' : 'Email или телефон'}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-yellow transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full py-4 md:py-5 bg-brand-yellow text-brand-dark rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-yellow/10 flex items-center justify-center gap-3 disabled:opacity-60"
                    >
                      {status === 'sending' ? 'Отправляем...' : (<>{p.cta} <ArrowRight size={18} /></>)}
                    </button>
                    <Honeypot />
                  </form>
                )}
              </div>

              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-white/30">
                Нажимая на кнопку, вы соглашаетесь с{' '}
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-privacy'))}
                  className="text-white/60 underline hover:text-brand-yellow transition-colors"
                >
                  политикой конфиденциальности
                </button>.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
