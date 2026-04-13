import React from 'react';
import { Mail, Phone, Instagram, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="footer" className="bg-brand-dark text-white py-24 pb-12 relative overflow-hidden">
      {/* Background shape */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center text-brand-dark font-black text-xl italic shadow-lg shadow-brand-yellow/20">SA</div>
              <span className="font-black uppercase tracking-tighter text-2xl italic">Strengths <span className="text-brand-accent not-italic">Academy</span></span>
            </div>
            <p className="text-gray-400 max-w-sm text-lg font-medium leading-relaxed mb-10">
              Международный стандарт развития команд и лидеров. Мы помогаем компаниям расти через раскрытие талантов каждого сотрудника.
            </p>
            <div className="flex gap-4">
               <a href="https://t.me/+eiCreYeHm9k4ZGE0" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all text-brand-yellow">
                  <Send size={20} />
               </a>
               <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all text-gray-400">
                  <Instagram size={20} />
               </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-brand-yellow">Навигация</h4>
            <ul className="space-y-4">
              {['Программы', 'Команда', 'Методология', 'Отзывы'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors font-bold uppercase text-[10px] tracking-[0.2em]">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-8 text-brand-yellow">Контакты</h4>
            <ul className="space-y-6">
              <li className="flex items-center gap-4 group">
                <a href="mailto:strengthsacademy.ru@gmail.com" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-accent transition-colors"><Mail size={18} /></div>
                  <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">strengthsacademy.ru@gmail.com</span>
                </a>
              </li>
              <li className="flex items-center gap-4 group">
                <a href="https://t.me/+eiCreYeHm9k4ZGE0" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-accent transition-colors"><Send size={18} /></div>
                  <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">Telegram Канал</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">&copy; 2024 Strengths Academy. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-[0.2em]">Политика конфиденциальности</a>
            <a href="#" className="text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-[0.2em]">Оферта</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
