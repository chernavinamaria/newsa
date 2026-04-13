import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ArrowUp } from 'lucide-react';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show after scrolling 500px
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[200] flex flex-col gap-4">
      <AnimatePresence>
        {isVisible && (
          <>
            <motion.a
                href="#products"
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-4 bg-brand-dark text-white px-8 py-4 rounded-full shadow-[0_20px_40px_rgba(0,48,63,0.3)] border border-brand-accent/20 group backdrop-blur-md"
            >
                <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center text-brand-dark group-hover:rotate-12 transition-transform">
                    <Target size={18} />
                </div>
                <span className="font-black uppercase tracking-widest text-xs pr-2 text-white">Выбрать программу</span>
            </motion.a>

            <motion.button
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ backgroundColor: '#F9FAFB' }}
              className="self-end w-12 h-12 bg-white text-brand-dark rounded-full shadow-xl flex items-center justify-center border border-gray-100"
            >
              <ArrowUp size={20} />
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
