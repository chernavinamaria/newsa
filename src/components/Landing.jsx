import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Plus, ChevronRight } from 'lucide-react';
import Footer from './Footer';
import PaymentModal from './PaymentModal';
import Test from './Test';
import { programs } from './Products';
import { reviews } from './Reviews';
import { clients } from './Clients';
import { submitLead } from '../config';
import { LANDING_NAV, RELATED_LINKS, SITE_URL } from '../seo/pages';

// SEO-лендинг. Контент приходит из src/seo/pages.js, страница пререндерится
// в статический HTML при сборке. Поэтому здесь НЕТ анимаций появления
// (opacity: 0 до загрузки JS) и FAQ сделан на <details>: ответы должны быть
// в HTML сразу, без JavaScript.

const SITE_STATS = [
  { value: '2500+', label: 'человек протестировано' },
  { value: '2000+', label: 'человек обучено' },
  { value: '15+', label: 'лет опыта в HR' }
];

const CONTACT_RE = /^([^\s@]+@[^\s@]+\.[^\s@]+|[+\d\s\-()]{5,})$/;

// Ширина самого длинного слова заголовка в «em» (с запасом на разные системные шрифты).
// На телефонах размер заголовка считается от неё, чтобы слово вроде «ПРОФОРИЕНТАЦИЯ»
// или «CLIFTONSTRENGTHS» помещалось в строку целиком и не рвалось посередине.
function fitEm(text) {
  const words = (Array.isArray(text) ? text.join(' ') : String(text || '')).split(/\s+/);
  const longest = Math.max(...words.map((w) => w.length), 1);
  return Math.max(longest * 0.84, 6);
}

function Heading({ title, light = false }) {
  const [first, second] = Array.isArray(title) ? title : [title];
  return (
    <>
      <h2
        style={{ '--fit': fitEm(title) }}
        className={`text-[length:clamp(1.25rem,calc((100vw_-_3rem)_/_var(--fit)),1.875rem)] leading-[1.15] md:text-5xl font-black uppercase italic tracking-tighter mb-4 ${light ? 'text-white' : 'text-brand-dark'}`}
      >
        {first}
        {second && (
          <>
            {' '}
            <span className={`not-italic ${light ? 'text-brand-yellow' : 'text-brand-accent'}`}>{second}</span>
          </>
        )}
      </h2>
      <div className="h-1.5 w-24 bg-brand-yellow mb-10" />
    </>
  );
}

function TextLink({ href, children }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 font-black uppercase tracking-widest text-xs text-brand-accent hover:text-brand-dark transition-colors"
    >
      {children} <ArrowRight size={14} />
    </a>
  );
}

// Кнопка или ссылка в зависимости от типа действия
function Action({ item, run, className, children }) {
  if (item.action.type === 'link') {
    return <a href={item.action.href} className={className}>{children}</a>;
  }
  return <button type="button" onClick={() => run(item.action)} className={className}>{children}</button>;
}

export default function Landing({ page }) {
  const [payProduct, setPayProduct] = useState(null);
  const [testOpen, setTestOpen] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '' });
  const [status, setStatus] = useState('idle');

  // Статический <head> проставляет пререндер. Этот эффект нужен только на случай,
  // когда страница открыта через SPA-фолбэк (index.html главной).
  React.useEffect(() => {
    document.title = page.meta.title;
    const set = (selector, attr, value) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };
    set('meta[name="description"]', 'content', page.meta.description);
    set('link[rel="canonical"]', 'href', SITE_URL + page.path);
  }, [page]);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const findProduct = (payId) => programs.find((p) => p.payId === payId);

  const goal = (name, params) => {
    if (typeof window.ym === 'function') window.ym(110314327, 'reachGoal', name, params);
  };

  const run = (action) => {
    if (!action) return;
    if (action.type === 'pay') {
      goal('landing-pay-click', { page: page.path, product: action.id });
      setPayProduct(findProduct(action.id));
    } else if (action.type === 'test') {
      goal('landing-test-click', { page: page.path });
      setTestOpen(true);
    } else if (action.type === 'scroll') {
      scrollTo(action.id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const contact = form.contact.trim();
    if (!name || !CONTACT_RE.test(contact)) {
      setStatus('invalid');
      return;
    }
    setStatus('sending');
    try {
      await submitLead({
        type: `лендинг: ${page.crumb}`.slice(0, 30),
        name,
        contact,
        source: page.lead.source || `Страница «${page.crumb}» (${page.path})`,
        notes: `Заявка со страницы ${page.path}`
      });
      goal('landing-lead', { page: page.path });
      setStatus('sent');
      setForm({ name: '', contact: '' });
    } catch {
      setStatus('error');
    }
  };

  const renderSection = (s, i) => {
    const bg = i % 2 === 0 ? 'bg-white' : 'bg-brand-light';
    const wrap = `py-14 md:py-24 ${bg} scroll-mt-20`;

    switch (s.type) {
      case 'prose':
        return (
          <section key={i} id={s.id} className={wrap}>
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <Heading title={s.title} />
              <div className="space-y-5">
                {s.paragraphs.map((p, k) => (
                  <p key={k} className="text-base md:text-lg text-gray-700 font-medium leading-relaxed">{p}</p>
                ))}
              </div>
              {s.link && <div className="mt-8"><TextLink href={s.link.href}>{s.link.label}</TextLink></div>}
            </div>
          </section>
        );

      case 'checks':
        return (
          <section key={i} id={s.id} className={wrap}>
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <Heading title={s.title} />
              <ul className="space-y-4">
                {s.items.map((item, k) => (
                  <li key={k} className="flex items-start gap-4">
                    <CheckCircle2 size={22} className="text-brand-accent shrink-0 mt-0.5" />
                    <span className="text-base md:text-lg text-gray-700 font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );

      case 'steps':
        return (
          <section key={i} id={s.id} className={wrap}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <Heading title={s.title} />
              <ol className={`grid gap-6 md:gap-8 ${s.items.length === 4 ? 'md:grid-cols-2 xl:grid-cols-4' : 'lg:grid-cols-3'}`}>
                {s.items.map((step, k) => (
                  <li key={k} className="bg-white rounded-[2rem] p-8 border border-gray-100">
                    <span className="block text-5xl font-black italic text-brand-yellow leading-none mb-5">
                      {String(k + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-lg font-black uppercase italic tracking-tight text-brand-dark mb-3 leading-tight">{step.title}</h3>
                    <p className="text-gray-600 font-medium leading-relaxed">{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        );

      case 'cards':
        return (
          <section key={i} id={s.id} className={wrap}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <Heading title={s.title} />
              <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
                {s.items.map((c, k) => (
                  <div key={k} className="bg-white rounded-[2rem] p-8 border border-gray-100">
                    <h3 className="text-xl font-black uppercase italic tracking-tight text-brand-dark mb-2 leading-tight">{c.title}</h3>
                    {c.meta && <p className="text-xs font-black uppercase tracking-widest text-brand-accent mb-4">{c.meta}</p>}
                    <p className="text-gray-600 font-medium leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>
              {s.cta && (
                <div className="mt-10">
                  <Action
                  run={run}
                    item={s.cta}
                    className="px-9 py-5 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm hover:bg-brand-accent transition-colors inline-flex items-center gap-3"
                  >
                    {s.cta.label} <ArrowRight size={18} />
                  </Action>
                </div>
              )}
            </div>
          </section>
        );

      case 'offer': {
        const product = findProduct(s.payId);
        if (!product) return null;
        const points = [...(s.extraPoints || []), ...product.points];
        return (
          <section key={i} id={s.id} className={wrap}>
            <div className="max-w-5xl mx-auto px-6 lg:px-8">
              <Heading title={s.title} />
              <div className="bg-brand-dark text-white rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-12 grid md:grid-cols-5 gap-8 md:gap-12 items-center">
                <div className="md:col-span-3 min-w-0">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl break-words hyphens-auto font-black uppercase italic tracking-tighter leading-none mb-4">{product.title}</h3>
                  <p className="text-blue-100/70 font-medium leading-relaxed mb-6">{product.purpose}</p>
                  <ul className="space-y-3">
                    {points.map((p, k) => (
                      <li key={k} className="flex items-start gap-3">
                        <CheckCircle2 size={20} className="text-brand-yellow shrink-0 mt-0.5" />
                        <span className="font-medium text-white/90">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-2 min-w-0 bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2">Стоимость</p>
                  <p className="text-4xl md:text-3xl lg:text-5xl font-black italic text-brand-yellow mb-6 whitespace-nowrap">{product.price}</p>
                  <button
                    type="button"
                    onClick={() => run({ type: 'pay', id: s.payId })}
                    className="w-full py-5 bg-brand-yellow text-brand-dark rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform inline-flex items-center justify-center gap-3"
                  >
                    {s.payLabel || 'Оплатить'} <ArrowRight size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTo('cta')}
                    className="mt-4 text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-brand-yellow transition-colors"
                  >
                    Задать вопрос
                  </button>
                </div>
              </div>
            </div>
          </section>
        );
      }

      case 'products': {
        const list = s.payIds.map(findProduct).filter(Boolean);
        return (
          <section key={i} id={s.id} className={wrap}>
            <div className="max-w-5xl mx-auto px-6 lg:px-8">
              <Heading title={s.title} />
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {list.map((p) => (
                  <div key={p.payId} className="bg-white rounded-[2rem] p-8 border border-gray-100 flex flex-col">
                    <p className="text-xs font-black uppercase tracking-widest text-brand-accent mb-3">{p.duration}</p>
                    <h3 className="text-lg min-[400px]:text-xl sm:text-2xl md:text-xl lg:text-2xl font-black uppercase italic tracking-tighter text-brand-dark leading-none mb-4">{p.title}</h3>
                    <p className="text-gray-600 font-medium leading-relaxed mb-5">{p.purpose}</p>
                    <ul className="space-y-2.5 mb-8">
                      {p.points.map((pt, k) => (
                        <li key={k} className="flex items-start gap-3">
                          <CheckCircle2 size={18} className="text-brand-accent shrink-0 mt-0.5" />
                          <span className="text-sm font-medium text-gray-700">{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                      <span className="text-2xl font-black italic text-brand-dark whitespace-nowrap">{p.price}</span>
                      <button
                        type="button"
                        onClick={() => run({ type: 'pay', id: p.payId })}
                        className="shrink-0 whitespace-nowrap px-6 py-4 bg-brand-dark text-white rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-brand-accent transition-colors"
                      >
                        Оплатить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      case 'programs': {
        const list = programs.filter((p) => p.segment === s.segment);
        return (
          <section key={i} id={s.id} className={wrap}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <Heading title={s.title} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {list.map((p) => (
                  <div key={p.title} className="min-w-0 bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 flex flex-col">
                    <p className="text-xs font-black uppercase tracking-widest text-brand-accent mb-3">{p.duration}</p>
                    <h3 className="text-lg min-[400px]:text-xl xl:text-2xl font-black uppercase italic tracking-tighter text-brand-dark leading-none mb-4">{p.title}</h3>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed mb-5">{p.purpose}</p>
                    <ul className="space-y-2.5 mb-8">
                      {p.points.map((pt, k) => (
                        <li key={k} className="flex items-start gap-3">
                          <CheckCircle2 size={18} className="text-brand-accent shrink-0 mt-0.5" />
                          <span className="text-sm font-medium text-gray-700">{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                      <span className="text-xl font-black italic text-brand-dark whitespace-nowrap">{p.price}</span>
                      <button
                        type="button"
                        onClick={() => scrollTo('cta')}
                        className="shrink-0 whitespace-nowrap px-5 py-3.5 bg-brand-dark text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-accent transition-colors"
                      >
                        Обсудить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      case 'quotes': {
        const list = s.pick.map((n) => reviews[n]).filter(Boolean);
        return (
          <section key={i} id={s.id} className={wrap}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <Heading title={s.title} />
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {list.map((r) => (
                  <figure key={r.name} className="bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100">
                    <blockquote className="text-base md:text-lg text-gray-700 font-medium leading-relaxed mb-6">
                      «{r.fullText}»
                    </blockquote>
                    <figcaption>
                      <p className="font-black uppercase italic tracking-tight text-brand-dark">{r.name}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">{r.company}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        );
      }

      case 'stats':
        return (
          <section key={i} id={s.id} className="py-14 md:py-20 bg-brand-dark text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid sm:grid-cols-3 gap-8 md:gap-12">
                {SITE_STATS.map((st) => (
                  <div key={st.label}>
                    <p className="text-5xl md:text-6xl font-black italic text-brand-yellow leading-none mb-3">{st.value}</p>
                    <p className="text-sm font-bold uppercase tracking-widest text-white/60">{st.label}</p>
                  </div>
                ))}
              </div>
              {s.clients && (
                <div className="mt-12 pt-10 border-t border-white/10">
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-6">
                    Нам доверяют команды ведущих компаний
                  </p>
                  <ul className="flex flex-wrap gap-x-10 gap-y-4">
                    {clients.map((c) => (
                      <li key={c.name} className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-white/80">{c.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        );

      case 'links':
        return (
          <section key={i} id={s.id} className={wrap}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <Heading title={s.title} />
              {s.intro && <p className="text-base md:text-lg text-gray-700 font-medium leading-relaxed mb-8 max-w-3xl">{s.intro}</p>}
              <LinkCards keys={s.items} />
            </div>
          </section>
        );

      case 'faq':
        return (
          <section key={i} id={s.id || 'faq'} className={wrap}>
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <Heading title={s.title || ['Частые', 'вопросы']} />
              <div className="space-y-3">
                {s.items.map((f, k) => (
                  <details key={k} className="group bg-white rounded-3xl border border-gray-200 open:border-brand-accent/40 open:shadow-lg transition-colors">
                    <summary className="flex items-center justify-between gap-4 p-6 md:p-7 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                      <h3 className="text-sm min-[360px]:text-base md:text-lg font-black uppercase italic tracking-tight text-brand-dark leading-tight pr-2">{f.q}</h3>
                      <span className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center bg-brand-light text-brand-dark transition-transform group-open:rotate-45 group-open:bg-brand-accent group-open:text-white">
                        <Plus size={18} />
                      </span>
                    </summary>
                    <div className="px-6 md:px-7 pb-6 md:pb-7">
                      <p className="text-gray-600 font-medium leading-relaxed">{f.a}</p>
                      {f.link && <div className="mt-4"><TextLink href={f.link.href}>{f.link.label}</TextLink></div>}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const { hero } = page;

  return (
    // Страховка для телефонов: длинное слово («ПРОФОРИЕНТАЦИЯ», «КОНСУЛЬТИРОВАНИЕ»),
    // которое не влезло в строку, переносится, а не распирает страницу вбок.
    // Размеры заголовков ниже подобраны так, чтобы на 360px+ до переноса не доходило.
    <div className="min-h-screen bg-white max-sm:[overflow-wrap:anywhere] max-sm:[&_h1]:hyphens-auto max-sm:[&_h2]:hyphens-auto max-sm:[&_h3]:hyphens-auto">
      {/* Шапка */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-3 sm:gap-6">
          <a href="/" className="flex items-center gap-2 sm:gap-3 shrink-0" aria-label="Strengths Academy, на главную">
            <div className="w-9 h-9 shrink-0 bg-brand-yellow rounded-xl flex items-center justify-center text-brand-dark font-black text-lg italic">SA</div>
            {/* До 360px название не помещается рядом с кнопкой: остаётся только значок */}
            <span className="hidden min-[360px]:inline whitespace-nowrap font-black uppercase tracking-tighter text-sm sm:text-lg md:text-xl italic text-brand-dark">
              Strengths <span className="text-brand-accent not-italic">Academy</span>
            </span>
          </a>
          <nav className="hidden xl:flex items-center gap-6" aria-label="Услуги">
            {LANDING_NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                aria-current={n.href === page.path ? 'page' : undefined}
                className={`text-[10px] font-black uppercase tracking-[0.15em] transition-colors ${
                  n.href === page.path ? 'text-brand-accent' : 'text-brand-dark/60 hover:text-brand-dark'
                }`}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => scrollTo('cta')}
            className="shrink-0 px-4 sm:px-5 md:px-7 py-3 bg-brand-dark text-white rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-brand-accent transition-colors"
          >
            Связаться
          </button>
        </div>
      </header>

      <main>
        {/* Первый экран */}
        <section className="relative overflow-hidden bg-brand-dark text-white">
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />
          <div className="absolute top-0 right-0 w-[60%] h-[70%] bg-gradient-to-bl from-brand-accent/30 via-brand-yellow/10 to-transparent rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-gradient-to-tr from-brand-green/15 via-transparent to-transparent rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-14 md:pt-10 md:pb-24 relative z-10">
            <nav aria-label="Хлебные крошки" className="mb-8 md:mb-12">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-black uppercase tracking-widest text-white/40">
                <li className="whitespace-nowrap"><a href="/" className="hover:text-white transition-colors">Главная</a></li>
                <li aria-hidden="true" className="shrink-0"><ChevronRight size={12} /></li>
                <li className="text-white/70">{page.crumb}</li>
              </ol>
            </nav>

            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8">
                <Sparkles className="text-brand-yellow" size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">{hero.eyebrow}</span>
              </div>

              <h1
                style={{ '--fit': fitEm(hero.h1) }}
                className="text-[length:clamp(1.375rem,calc((100vw_-_3rem)_/_var(--fit)),2.25rem)] sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase italic tracking-tighter leading-[0.95] mb-8"
              >
                {hero.h1.map((line, k) => (
                  <span key={k} className={`block ${k >= hero.accentFrom ? 'text-brand-yellow not-italic' : ''}`}>{line}{' '}</span>
                ))}
              </h1>

              <div className="relative mb-10 pl-5">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-yellow" />
                <p className="text-base md:text-lg text-blue-100/80 font-medium leading-relaxed max-w-2xl">{hero.lead}</p>
              </div>

              <ul className="flex flex-wrap gap-2 md:gap-3 mb-10">
                {hero.chips.map((chip) => (
                  <li
                    key={chip}
                    className="inline-flex items-center px-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-[11px] md:text-xs font-black uppercase tracking-wider text-white/90"
                  >
                    {chip}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Action
                  run={run}
                  item={hero.primary}
                  className="px-9 md:px-11 py-5 bg-brand-yellow text-brand-dark rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm shadow-2xl shadow-brand-yellow/10 inline-flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  {hero.primary.label} <ArrowRight size={18} />
                </Action>
                {hero.secondary && (
                  <Action
                  run={run}
                    item={hero.secondary}
                    className="px-9 py-5 bg-white/5 border border-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm inline-flex items-center justify-center gap-3 hover:bg-white/10 transition-colors"
                  >
                    {hero.secondary.label}
                  </Action>
                )}
              </div>
              {hero.note && (
                <p className="mt-6 text-[10px] md:text-xs font-black uppercase tracking-widest text-white/40 leading-relaxed max-w-xl">
                  {hero.note}
                </p>
              )}
            </div>
          </div>
        </section>

        {page.sections.map(renderSection)}

        {/* Заявка */}
        <section id="cta" className="py-14 md:py-24 bg-white px-6 scroll-mt-20">
          <div className="max-w-7xl mx-auto relative overflow-hidden bg-brand-dark rounded-[2.5rem] md:rounded-[4rem] p-6 sm:p-8 md:p-12 lg:p-16 text-white">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-accent/10 -skew-x-12 translate-x-1/4 pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="min-w-0">
                <h2
                  style={{ '--fit': fitEm(page.lead.title) }}
                  className="text-[length:clamp(1.125rem,calc((100vw_-_6rem)_/_var(--fit)),1.5rem)] sm:text-3xl xl:text-4xl font-black uppercase italic tracking-tighter leading-[0.95] mb-6"
                >
                  {page.lead.title}
                </h2>
                <p className="text-base md:text-lg text-blue-100/70 font-medium leading-relaxed mb-6">{page.lead.text}</p>
                <a
                  href="https://t.me/strengthsacademy_bot?start=fromsite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold uppercase tracking-widest text-brand-yellow hover:text-white transition-colors"
                >
                  Или напишите нам в Telegram
                </a>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10">
                {status === 'sent' ? (
                  <div className="text-center py-6" role="status">
                    <CheckCircle2 size={44} className="text-brand-yellow mx-auto mb-4" />
                    <p className="text-lg font-black uppercase italic text-brand-yellow mb-3">Заявка отправлена</p>
                    <p className="text-sm text-white/80 leading-relaxed">Мы свяжемся с вами в течение рабочего дня.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                    <input
                      required
                      type="text"
                      name="name"
                      autoComplete="name"
                      aria-label="Ваше имя"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Ваше имя"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-yellow transition-colors"
                    />
                    <input
                      required
                      type="text"
                      name="contact"
                      aria-label="Email или телефон"
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
                      {status === 'sending' ? 'Отправляем...' : (<>Отправить заявку <ArrowRight size={18} /></>)}
                    </button>
                    {status === 'invalid' && (
                      <p className="text-center text-xs font-bold text-brand-orange" role="alert">
                        Укажите имя и один контакт: email или телефон.
                      </p>
                    )}
                    {status === 'error' && (
                      <p className="text-center text-xs font-bold text-brand-orange" role="alert">
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

        {/* Перелинковка */}
        <section className="py-14 md:py-24 bg-brand-light">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <Heading title={['Что ещё', 'посмотреть']} />
            <LinkCards keys={page.related} />
          </div>
        </section>
      </main>

      <Footer />

      <PaymentModal isOpen={!!payProduct} onClose={() => setPayProduct(null)} product={payProduct} />
      <Test isOpen={testOpen} onClose={() => setTestOpen(false)} />
    </div>
  );
}

function LinkCards({ keys }) {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
      {keys.map((key) => {
        const item = RELATED_LINKS[key];
        if (!item) return null;
        return (
          <a
            key={key}
            href={item.href}
            className="group bg-white rounded-[2rem] p-7 border border-gray-100 hover:border-brand-accent/40 hover:shadow-lg transition-all flex flex-col"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent mb-3">{item.meta}</span>
            <span className="text-lg font-black uppercase italic tracking-tight text-brand-dark leading-tight mb-3">{item.title}</span>
            <span className="text-sm text-gray-600 font-medium leading-relaxed mb-5">{item.text}</span>
            <span className="mt-auto inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-brand-dark group-hover:text-brand-accent transition-colors">
              Подробнее <ArrowRight size={14} />
            </span>
          </a>
        );
      })}
    </div>
  );
}
