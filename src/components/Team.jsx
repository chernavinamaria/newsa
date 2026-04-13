import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import ekaterinaImg from '../assets/Ekaterina.jpg';
import evgeniaImg from '../assets/Evgenia.jpg';

const team = [
  {
    name: 'Екатерина Туркевич',
    role: 'Co-founder Strengths Academy',
    bio: 'Более 15 лет в HR, более 7 лет на топ менеджерских позициях (HRD, CEO) Decathlon Russia, Rostic’s / KFC.',
    fullBio: 'Бизнес-коуч (ICF PWC), бизнес-тренер, эксперт в области развития сильных сторон Gallup CliftonStrengths и управления изменениями.',
    image: ekaterinaImg
  },
  {
    name: 'Евгения Кудрявцева',
    role: 'Co-founder Strengths Academy',
    bio: 'Дипломированный бизнес-тренер, сертифицированный международный фасилитатор и оценщик на базе инструментов Talent Q Pro.',
    fullBio: 'Эксперт в области развития сильных сторон на базе инструмента Gallup CliftonStrengths. Член ассоциации бизнес-тренеров.',
    image: evgeniaImg
  }
];

export default function Team() {
  const [activeMember, setActiveMember] = useState(null);

  // Sync active member with URL hash for proper browser "Back" button behavior
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
    window.location.hash = `team-${index}`;
    setActiveMember(member);
  };

  const handleCloseMember = () => {
    if (window.location.hash.startsWith('#team-')) {
      window.history.back();
    } else {
      setActiveMember(null);
    }
  };

  return (
    <section id="team" className="py-32 bg-brand-dark text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="mb-20 text-center md:text-left">
          <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter italic">
            Наши <span className="text-brand-accent not-italic">Эксперты</span>
          </h2>
          <div className="h-1.5 w-40 bg-brand-yellow mb-8 mx-auto md:mx-0"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          {team.map((member, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
              onClick={() => handleOpenMember(member, idx)}
            >
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 group-hover:border-brand-yellow/30 transition-all duration-500">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover object-top grayscale brightness-90 group-hover:grayscale-0 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10">
                   <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-4">{member.name}</h3>
                   <p className="text-brand-accent font-bold uppercase text-[10px] tracking-[0.2em] mb-4">Подробнее об опыте</p>
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
                onClick={handleCloseMember} 
                className="absolute top-4 right-4 md:top-6 md:right-6 p-4 md:p-2 bg-brand-light hover:bg-gray-200 transition-colors z-20 rounded-full"
              >
                <X size={24} />
              </button>

              <div className="w-full md:w-80 h-1/2 md:h-auto shrink-0 relative bg-gray-100">
                 <img src={activeMember.image} alt={activeMember.name} className="w-full h-full object-cover object-top" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden"></div>
                 <div className="absolute bottom-6 left-6 text-white md:hidden">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-1">{activeMember.name}</h3>
                    <p className="text-brand-yellow font-bold uppercase text-[10px] tracking-widest">{activeMember.role}</p>
                 </div>
              </div>

              <div className="flex-grow p-6 md:p-12 overflow-y-auto">
                <div className="hidden md:block">
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">{activeMember.name}</h3>
                  <p className="text-brand-accent font-bold uppercase text-xs tracking-widest mb-10">{activeMember.role}</p>
                </div>

                <div className="space-y-6 md:space-y-8 font-medium">
                  <div className="p-5 md:p-6 bg-brand-light rounded-2xl border-l-4 border-brand-accent">
                    <p className="text-base md:text-lg font-black leading-tight text-brand-dark">{activeMember.bio}</p>
                  </div>
                  <div className="space-y-3 md:space-y-4 text-gray-600 leading-relaxed text-sm md:text-base">
                     {activeMember.fullBio.split(',').map((item, i) => (
                       <div key={i} className="flex gap-3">
                          <CheckCircle2 size={16} className="text-brand-yellow mt-1 shrink-0" />
                          <span>{item.trim()}</span>
                       </div>
                     ))}
                  </div>
                </div>
                
                <div className="mt-10 pt-8 border-t border-brand-light md:hidden">
                    <button className="w-full py-4 bg-brand-dark text-white rounded-xl font-black uppercase tracking-widest text-sm">
                      Связаться
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
