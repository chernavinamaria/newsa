import React from 'react';
import { motion } from 'framer-motion';

// Логотипы: положи файлы в src/assets/logos/ и раскомментируй import + поле logo.
// Пример: import decathlon from '../assets/logos/decathlon.svg';
// Пока logo не задан — показывается название текстом (ч/б wordmark).

export const clients = [
  { name: 'Decathlon', logo: null },
  { name: 'Auchan', logo: null },
  { name: "Rostic's", logo: null },
  { name: 'KFC', logo: null },
  { name: 'GetExperts', logo: null },
];

export default function Clients() {
  return (
    <section id="clients" className="py-14 md:py-20 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-center text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-brand-dark/40 mb-8 md:mb-12">
          Нам доверяют команды ведущих компаний
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 md:gap-x-16 lg:gap-x-20">
          {clients.map((client, idx) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="group"
            >
              {client.logo ? (
                <img
                  src={client.logo}
                  alt={client.name}
                  className="h-8 md:h-10 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              ) : (
                <span className="text-xl md:text-2xl font-black uppercase tracking-tight text-brand-dark/35 group-hover:text-brand-dark transition-colors duration-300">
                  {client.name}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
