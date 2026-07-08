import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Layers, Clock } from 'lucide-react';

export default function Modal({ isOpen, onClose, product }) {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-0 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-dark/95 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="relative w-full h-full md:max-w-5xl md:max-h-[90vh] bg-white md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row shadow-[0_32px_128px_rgba(0,0,0,0.5)]"
          >
            {/* Close Button - More prominent on mobile */}
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 md:top-6 md:right-6 p-4 md:p-3 bg-white/20 hover:bg-white/30 md:bg-brand-light md:hover:bg-gray-200 backdrop-blur-md rounded-full z-[180] transition-colors shadow-sm text-white md:text-brand-dark"
            >
              <X size={28} />
            </button>

            {/* Sidebar */}
            <div className={`h-1/3 md:h-auto md:w-1/3 p-8 md:p-12 text-white flex flex-col justify-end md:justify-between relative overflow-hidden shrink-0 ${product.color || 'bg-brand-dark'}`}>
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80 md:from-black/20 md:to-black/60"></div>
              <div className="relative z-10 mb-4 md:mb-0">
                <div className="hidden md:flex w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-xl rounded-2xl items-center justify-center mb-10 md:mb-12 border border-white/20">
                   <Layers size={32} />
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none mb-4">{product.title}</h2>
                <div className="h-1.5 w-16 md:w-20 bg-brand-yellow"></div>
              </div>
              <div className="relative z-10 flex md:flex-col gap-6 md:gap-4 items-center md:items-start">
                 <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs font-black uppercase tracking-widest leading-none">
                    <Clock size={16} className="text-brand-yellow" /> {product.duration}
                 </div>
                 <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs font-black uppercase tracking-widest text-white/70 leading-none">
                    {product.audience}
                 </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow overflow-y-auto p-6 md:p-12 relative bg-white selection:bg-brand-yellow selection:text-brand-dark">
              <div className="space-y-10 md:space-y-16">
                <section>
                  <p className="text-lg md:text-2xl font-bold text-brand-dark leading-relaxed mb-8 italic border-l-4 border-brand-yellow pl-6 md:pl-8">
                    {product.purpose}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {product.points?.map((pt, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 md:p-4 bg-brand-light rounded-xl border border-transparent">
                        <CheckCircle2 size={16} className="text-brand-accent shrink-0" />
                        <span className="text-xs md:text-sm font-bold text-gray-700">{pt}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Механика скрыта до финализации */}

                <div className="py-8 md:pt-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 border-t border-brand-light">
                   {product.price && (
                     <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Стоимость</span>
                       <span className="text-3xl md:text-4xl font-black italic tracking-tight text-brand-dark">{product.price}</span>
                     </div>
                   )}
                   <button
                     onClick={() => {
                       onClose();
                       setTimeout(() => {
                         document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
                       }, 300);
                     }}
                     className="w-full md:w-auto px-10 py-5 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest hover:bg-brand-accent transition-all shadow-xl"
                   >
                      Пройти тест
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
