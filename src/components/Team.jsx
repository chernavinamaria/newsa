import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import ekaterinaImg from '../assets/Ekaterina.jpg';
import evgeniaImg from '../assets/Evgenia.jpg';
import mariaImg from '../assets/Maria.jpg';

const team = [
  {
    name: 'Екатерина Туркевич',
    role: 'CEO · Co-founder',
    bio: 'Более 15 лет создаёт среду для развития людей, разрабатывает и проводит тренинги по всему миру.',
    strengths: ['Strategic', 'Achiever', 'Activator', 'Focus', 'Arranger'],
    image: ekaterinaImg
  },
  {
    name: 'Евгения Кудрявцева',
    role: 'Бизнес-тренер · Co-founder',
    bio: 'В HR более 13 лет. Фасилитатор, бизнес-тренер, методолог образовательных программ, эксперт в области развития сильных сторон.',
    strengths: ['Maximizer', 'Adaptability', 'Futuristic', 'Relator', 'Significance'],
    image: evgeniaImg,
    imgPos: '50% 50%' // лицо по центру кадра — сдвигаем вниз, чтобы плашка с именем не закрывала лицо
  },
  {
    name: 'Мария Чернавина',
    role: 'CMO',
    bio: '10 лет в маркетинге и 5 в HR. Эксперт в цифровом маркетинге и бренд-менеджменте.',
    strengths: ['Woo', 'Includer', 'Activator', 'Communication', 'Positivity'],
    image: mariaImg
  }
];

export default function Team() {
  const [activeMember, setActiveMember] = useState(null);

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#team-')) {
        const index = parseInt(hash.split('-')[1]);
        if (!isNaN(index) && team[index]) {
          setActiveMember(team[index]);
          return;
        }
      }
      setActiveMember(null);
    };
    window.addEventListener('popstate', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('popstate', handleHashChange);
  }, []);

  const handleOpenMember = (member, index) => {
    // pushState (а не hash=) гарантирует запись в истории для отката
    window.history.pushState({ member: index }, '', `#team-${index}`);
    setActiveMember(member);
  };

  const handleCloseMember = () => {
    // Закрываем сразу через состояние — не полагаемся на popstate/history.back
    // (в Safari на iOS программный back() ненадёжен и модалка «зависала»).
    setActiveMember(null);
    if (window.location.hash.startsWith('#team-')) {
      window.history.back(); // подчистить #team-N из URL/истории (гарантированно есть запись)
    }
  };

  return (
    <section id="team" className="py-16 md:py-32 bg-brand-dark text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="mb-10 md:mb-20 text-center md:text-left">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 uppercase tracking-tighter italic">
            Наши <span className="text-brand-accent not-italic">Эксперты</span>
          </h2>
          <div className="h-1.5 w-32 md:w-40 bg-brand-yellow mb-8 mx-auto md:mx-0"></div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
              onClick={() => handleOpenMember(member, idx)}
            >
              <div className="relative aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 group-hover:border-brand-yellow/40 transition-all duration-500 bg-white/5">
                <img
                  src={member.image}
                  alt={member.name}
                  style={{ objectPosition: member.imgPos || '50% 0%' }}
                  className="w-full h-full object-cover grayscale brightness-90 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent"></div>
                <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10">
                  <p className="text-brand-yellow font-black uppercase text-[10px] tracking-[0.2em] mb-2">{member.role}</p>
                  <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-3">{member.name}</h3>
                  <p className="text-brand-accent font-bold uppercase text-[10px] tracking-widest">Подробнее об эксперте →</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeMember && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleCloseMember}
              className="absolute inset-0 bg-brand-dark/95 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full h-full md:max-w-4xl md:max-h-[90vh] bg-white text-brand-dark md:rounded-[3rem] overflow-y-auto flex flex-col md:flex-row shadow-2xl"
            >
              <button
                type="button"
                aria-label="Закрыть"
                onClick={handleCloseMember}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-3 bg-brand-light hover:bg-gray-200 transition-colors z-20 rounded-full"
              >
                <X size={22} />
              </button>

              <div className="w-full md:w-80 h-64 md:h-auto shrink-0 relative bg-gray-100">
                 <img src={activeMember.image} alt={activeMember.name} style={{ objectPosition: activeMember.imgPos || '50% 0%' }} className="w-full h-full object-cover grayscale brightness-90" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden"></div>
                 <div className="absolute bottom-6 left-6 text-white md:hidden">
                    <p className="text-brand-yellow font-bold uppercase text-[10px] tracking-widest mb-1">{activeMember.role}</p>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">{activeMember.name}</h3>
                 </div>
              </div>

              <div className="flex-grow p-6 md:p-12 overflow-y-auto">
                <div className="hidden md:block">
                  <p className="text-brand-accent font-black uppercase text-xs tracking-widest mb-3">{activeMember.role}</p>
                  <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-6">{activeMember.name}</h3>
                </div>

                <div className="space-y-6 md:space-y-8">
                  <div className="p-5 md:p-6 bg-brand-light rounded-2xl border-l-4 border-brand-accent">
                    <p className="text-base md:text-lg font-medium leading-relaxed text-brand-dark">{activeMember.bio}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles size={16} className="text-brand-yellow" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/60">ТОП-5 Талантов по Gallup</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeMember.strengths.map((s, i) => (
                        <span key={i} className={`px-4 py-2 rounded-full text-xs md:text-sm font-black uppercase tracking-wider ${
                          i === 0 ? 'bg-brand-yellow text-brand-dark' :
                          i === 1 ? 'bg-brand-accent text-white' :
                          'bg-brand-light text-brand-dark'
                        }`}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-brand-light">
                    <button
                      onClick={() => {
                        handleCloseMember();
                        setTimeout(() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' }), 300);
                      }}
                      className="w-full md:w-auto px-8 py-4 bg-brand-dark text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-brand-accent transition-colors"
                    >
                      Записаться на встречу
                    </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
