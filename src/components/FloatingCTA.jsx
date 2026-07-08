import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, Send, ArrowUp, X } from 'lucide-react';

const PHONE_RU = '+79264492409';
const PHONE_NL = '+31653322331';
const TELEGRAM_CHAT_URL = 'https://t.me/strengthsacademy_bot?start=fromsite';
const TELEGRAM_CHANNEL_URL = 'https://t.me/strengths_academy';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 500);
    const onModalOpen = () => setModalOpen(true);
    const onModalClose = () => setModalOpen(false);
    window.addEventListener('scroll', toggleVisibility);
    window.addEventListener('modal-open', onModalOpen);
    window.addEventListener('modal-close', onModalClose);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('modal-open', onModalOpen);
      window.removeEventListener('modal-close', onModalClose);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[200] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isVisible && isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="flex flex-col gap-2 items-end"
          >
            <a
              href={`tel:${PHONE_RU}`}
              className="flex items-center gap-3 pl-4 pr-5 py-3 bg-white text-brand-dark rounded-full shadow-xl border border-gray-100 hover:bg-brand-yellow transition-colors group"
            >
              <div className="w-8 h-8 bg-brand-yellow group-hover:bg-brand-dark group-hover:text-white rounded-full flex items-center justify-center text-brand-dark transition-colors">
                <Phone size={16} />
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[9px] font-bold uppercase tracking-widest text-brand-dark/50">🇷🇺 Позвонить</span>
                <span className="text-xs font-black tracking-tight">+7 926 449-24-09</span>
              </div>
            </a>
            <a
              href={`tel:${PHONE_NL}`}
              className="flex items-center gap-3 pl-4 pr-5 py-3 bg-white text-brand-dark rounded-full shadow-xl border border-gray-100 hover:bg-brand-yellow transition-colors group"
            >
              <div className="w-8 h-8 bg-brand-yellow group-hover:bg-brand-dark group-hover:text-white rounded-full flex items-center justify-center text-brand-dark transition-colors">
                <Phone size={16} />
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[9px] font-bold uppercase tracking-widest text-brand-dark/50">🇳🇱 Позвонить</span>
                <span className="text-xs font-black tracking-tight">+31 6 5332-2331</span>
              </div>
            </a>
            <a
              href={TELEGRAM_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 pl-4 pr-5 py-3 bg-brand-dark text-white rounded-full shadow-xl border border-brand-accent/30 hover:bg-brand-accent transition-colors group"
            >
              <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center text-brand-dark">
                <Send size={16} />
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">Быстрый чат</span>
                <span className="text-xs font-black tracking-tight">Написать в Telegram</span>
              </div>
            </a>
            <a
              href={TELEGRAM_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 pl-4 pr-5 py-3 bg-white text-brand-dark rounded-full shadow-xl border border-gray-100 hover:bg-brand-accent hover:text-white transition-colors group"
            >
              <div className="w-8 h-8 bg-brand-accent/20 group-hover:bg-white/20 rounded-full flex items-center justify-center text-brand-accent group-hover:text-white transition-colors">
                <Send size={16} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Наш Telegram-канал</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVisible && !modalOpen && (
          <>
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 pl-4 pr-5 py-3.5 md:pl-5 md:pr-6 md:py-4 bg-brand-dark text-white rounded-full shadow-[0_20px_40px_rgba(0,48,63,0.35)] border border-brand-accent/20 backdrop-blur-md"
            >
              <div className="w-7 h-7 md:w-8 md:h-8 bg-brand-yellow rounded-full flex items-center justify-center text-brand-dark">
                {isOpen ? <X size={16} /> : <MessageCircle size={16} />}
              </div>
              <span className="font-black uppercase tracking-widest text-[10px] md:text-xs">
                {isOpen ? 'Закрыть' : 'Связаться'}
              </span>
            </motion.button>

            {!isOpen && (
              <motion.button
                onClick={scrollToTop}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-10 h-10 md:w-11 md:h-11 bg-white/80 text-brand-dark rounded-full shadow-md flex items-center justify-center border border-gray-100 backdrop-blur-md"
              >
                <ArrowUp size={16} />
              </motion.button>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
