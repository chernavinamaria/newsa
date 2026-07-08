import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Loader2, CreditCard } from 'lucide-react';
import { BACKEND_URL } from '../config';

export default function PaymentModal({ isOpen, onClose, product }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent('modal-open'));
    } else {
      window.dispatchEvent(new CustomEvent('modal-close'));
    }
  }, [isOpen]);

  if (!product) return null;

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = name.trim().length > 1 && emailOk && !loading;

  const handlePay = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    try {
      const resp = await fetch(`${BACKEND_URL}/tb-init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.payId, name: name.trim(), email: email.trim(), phone: phone.trim() })
      });
      const data = await resp.json();
      if (data.ok && data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }
      setError(data.error || 'Не удалось создать платёж. Попробуйте ещё раз.');
    } catch {
      setError('Ошибка соединения. Попробуйте ещё раз или напишите нам в Telegram.');
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
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
            className="relative w-full max-w-lg bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-3 bg-brand-light hover:bg-gray-200 rounded-full z-10 transition-colors text-brand-dark"
            >
              <X size={22} />
            </button>

            <div className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center text-brand-dark shrink-0">
                  <CreditCard size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Оплата картой онлайн</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-brand-dark leading-none mb-1">
                {product.title}
              </h3>
              <div className="text-xl font-black text-brand-accent mb-6">{product.price}</div>

              <form onSubmit={handlePay} className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ваше имя *"
                  className="w-full px-5 py-4 bg-brand-light rounded-xl font-bold text-sm text-brand-dark placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-brand-accent"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email — сюда придут коды и инструкции *"
                  className="w-full px-5 py-4 bg-brand-light rounded-xl font-bold text-sm text-brand-dark placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-brand-accent"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Телефон (необязательно)"
                  className="w-full px-5 py-4 bg-brand-light rounded-xl font-bold text-sm text-brand-dark placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-brand-accent"
                />

                {error && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-brand-accent transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />}
                  {loading ? 'Создаём платёж…' : 'Перейти к оплате'}
                </button>

                <p className="text-[11px] text-gray-400 font-medium leading-relaxed text-center">
                  Оплата проходит на защищённой странице Т-Банка. Нажимая кнопку, вы принимаете{' '}
                  <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('open-offer'))} className="underline hover:text-brand-dark">условия оферты</button>
                  {' '}и{' '}
                  <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('open-privacy'))} className="underline hover:text-brand-dark">политику конфиденциальности</button>.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
