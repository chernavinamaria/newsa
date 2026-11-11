import React, { useState, useEffect } from 'react';
import { Mail, Phone, Linkedin, Send } from 'lucide-react';
import Privacy from './Privacy';
import Offer from './Offer';

export default function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);

  useEffect(() => {
    const handler = () => setPrivacyOpen(true);
    const offerHandler = () => setOfferOpen(true);
    window.addEventListener('open-privacy', handler);
    window.addEventListener('open-offer', offerHandler);
    return () => {
      window.removeEventListener('open-privacy', handler);
      window.removeEventListener('open-offer', offerHandler);
    };
  }, []);
  return (
    <footer id="footer" className="bg-brand-dark text-white pt-14 pb-10 md:py-24 md:pb-12 relative overflow-hidden">
      {/* Background shape */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-10 md:mb-20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center text-brand-dark font-black text-xl italic shadow-lg shadow-brand-yellow/20">SA</div>
              <span className="font-black uppercase tracking-tighter text-2xl italic">Strengths <span className="text-brand-accent not-italic">Academy</span></span>
            </div>
            <p className="text-gray-400 max-w-sm text-lg font-medium leading-relaxed mb-10">
              Международный стандарт развития команд и лидеров. Мы помогаем компаниям расти через раскрытие талантов каждого сотрудника.
            </p>
            <div className="flex gap-4">
               <a href="https://t.me/strengths_academy" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all text-brand-yellow">
                  <Send size={20} />
               </a>
               <a href="https://www.linkedin.com/company/strengthsacademy" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all text-gray-400">
                  <Linkedin size={20} />
               </a>
            </div>
          </div>
          
          {/* Обычные ссылки на страницы услуг: работают без JS и видны поисковикам */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-brand-yellow">Услуги</h4>
            <ul className="space-y-4">
              {[
                { name: 'Тест Gallup', href: '/gallup-test' },
                { name: 'Карьерная консультация', href: '/karernaya-konsultaciya' },
                { name: 'Профориентация 16+', href: '/proforientaciya' },
                { name: 'Тренинги для команд', href: '/treningi-dlya-komand' },
                { name: 'Онлайн-программа', href: '/program' },
                { name: 'Бесплатный тест', href: '/test-na-silnye-storony' }
              ].map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-gray-400 hover:text-white transition-colors font-bold uppercase text-[10px] tracking-[0.2em]">{item.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-brand-yellow">Навигация</h4>
            <ul className="space-y-4">
              {[
                // Со слэшем: футер стоит и на внутренних страницах, якорь должен вести на главную
                { name: 'Программы', href: '/#products' },
                { name: 'Методология', href: '/#methodology' },
                { name: 'Команда', href: '/#team' },
                { name: 'Отзывы', href: '/#reviews' },
                { name: 'Новости', href: '/#news' }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-gray-400 hover:text-white transition-colors font-bold uppercase text-[10px] tracking-[0.2em]">{item.name}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-brand-yellow">Контакты</h4>
            <ul className="space-y-5">
              <li>
                <a href="tel:+79264492409" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-accent transition-colors"><Phone size={18} /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">🇷🇺 Россия</span>
                    <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">+7 926 449-24-09</span>
                  </div>
                </a>
              </li>
              <li>
                <a href="tel:+31653322331" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-accent transition-colors"><Phone size={18} /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">🇳🇱 Европа</span>
                    <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">+31 6 5332-2331</span>
                  </div>
                </a>
              </li>
              <li>
                <a href="https://t.me/strengthsacademy_bot?start=fromsite" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center text-brand-yellow group-hover:bg-brand-yellow group-hover:text-brand-dark transition-colors"><Send size={18} /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Быстрый чат</span>
                    <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">Написать в Telegram</span>
                  </div>
                </a>
              </li>
              <li>
                <a href="https://t.me/strengths_academy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-accent transition-colors"><Send size={18} /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Канал с материалами</span>
                    <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">@strengths_academy</span>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:strengthsacademy.ru@gmail.com" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-accent transition-colors"><Mail size={18} /></div>
                  <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors break-all">strengthsacademy.ru@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">&copy; 2026 Strengths Academy. All rights reserved.</p>
            <div className="flex flex-wrap gap-6">
              <button onClick={() => setOfferOpen(true)} className="text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-[0.2em]">Публичная оферта</button>
              <button onClick={() => setPrivacyOpen(true)} className="text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-[0.2em]">Политика конфиденциальности</button>
            </div>
          </div>
          <p className="text-gray-600 text-[10px] leading-relaxed">
            ИП Кудрявцева Евгения Павловна · ИНН 503411268099 · ОГРНИП 325508100008542
          </p>
        </div>
      </div>
      <Privacy isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <Offer isOpen={offerOpen} onClose={() => setOfferOpen(false)} />
    </footer>
  );
}
