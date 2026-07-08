import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

export default function PaymentResult({ ok }) {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('OrderId');
  const amount = params.get('Amount');

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-14 text-center"
      >
        <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-8 ${ok ? 'bg-brand-green/10 text-brand-green' : 'bg-red-50 text-red-500'}`}>
          {ok ? <CheckCircle2 size={44} /> : <XCircle size={44} />}
        </div>

        <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-brand-dark leading-none mb-5">
          {ok ? 'Оплата прошла!' : 'Оплата не прошла'}
        </h1>

        {ok ? (
          <div className="space-y-4 mb-10">
            <p className="text-base md:text-lg text-gray-600 font-medium leading-relaxed">
              Спасибо! Мы получили вашу оплату
              {amount && !isNaN(Number(amount)) ? <> на сумму <b>{Number(amount) / 100} ₽</b></> : null}.
              В течение <b>24 часов</b> отправим на вашу почту коды доступа и инструкции.
            </p>
            {orderId && (
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Номер заказа: {orderId}
              </p>
            )}
            <p className="text-sm text-gray-500 font-medium">
              Вопросы? Пишите в Telegram:{' '}
              <a href="https://t.me/strengthsacademy_bot" target="_blank" rel="noopener noreferrer" className="text-brand-accent font-bold underline">
                @strengthsacademy_bot
              </a>
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-10">
            <p className="text-base md:text-lg text-gray-600 font-medium leading-relaxed">
              Платёж не был завершён — деньги не списаны. Попробуйте ещё раз или напишите нам, поможем.
            </p>
            <p className="text-sm text-gray-500 font-medium">
              Telegram:{' '}
              <a href="https://t.me/strengthsacademy_bot" target="_blank" rel="noopener noreferrer" className="text-brand-accent font-bold underline">
                @strengthsacademy_bot
              </a>
            </p>
          </div>
        )}

        <a
          href="/#products"
          className="inline-flex items-center gap-3 px-10 py-5 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-accent transition-all shadow-xl"
        >
          <ArrowLeft size={16} /> Вернуться на сайт
        </a>
      </motion.div>
    </div>
  );
}
