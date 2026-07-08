import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Privacy({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[220] flex items-end md:items-center justify-center p-0 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-dark/95 backdrop-blur-md"
          />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-h-[85vh] md:max-w-3xl md:max-h-[85vh] bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-y-auto flex flex-col overscroll-contain"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-3 bg-brand-light hover:bg-gray-200 rounded-full z-10 transition-colors text-brand-dark"
            >
              <X size={22} />
            </button>
            <div className="p-6 md:p-10 pt-16 md:pt-14 text-brand-dark">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent mb-3">Юридическая информация</p>
              <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-8">
                Политика обработки <br/> <span className="text-brand-accent not-italic">персональных данных</span>
              </h2>

              <div className="space-y-6 text-sm md:text-base text-gray-700 leading-relaxed">
                <p>
                  Настоящая Политика в отношении обработки персональных данных подготовлена в соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных пользователей сайта strengthsacademy.ru (далее — Сайт).
                </p>
                <p>
                  Оператор персональных данных: <b>Индивидуальный предприниматель Кудрявцева Евгения Павловна</b> (ИНН 503411268099, ОГРНИП 325508100008542).
                </p>

                <h3 className="text-xl font-black uppercase italic tracking-tight text-brand-dark pt-4">1. Цели обработки данных</h3>
                <p>Персональные данные Пользователей обрабатываются в целях:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>осуществления клиентской поддержки;</li>
                  <li>получения Пользователем информации о маркетинговых событиях;</li>
                  <li>проведения аудита и прочих внутренних исследований с целью повышения качества предоставляемых услуг.</li>
                </ul>

                <h3 className="text-xl font-black uppercase italic tracking-tight text-brand-dark pt-4">2. Собираемые сведения</h3>
                <p>
                  В процессе обработки собираются следующие персональные данные: фамилия, имя, отчество, дата рождения, номер телефона, адрес электронной почты и почтовый адрес.
                </p>

                <h3 className="text-xl font-black uppercase italic tracking-tight text-brand-dark pt-4">3. Основные положения</h3>
                <p>
                  Данные хранятся на электронных носителях и обрабатываются автоматизированными системами. Компания не передаёт персональные данные третьим лицам, за исключением случаев передачи в государственные органы Российской Федерации на законодательных основаниях, а также стратегическим партнёрам, получающим минимальный объём персональных данных, необходимый только для оказания требуемой услуги.
                </p>

                <h3 className="text-xl font-black uppercase italic tracking-tight text-brand-dark pt-4">4. Права пользователя</h3>
                <p>
                  Пользователь вправе запросить у Компании информацию об обработке своих персональных данных, их изменение или удаление. Для этого необходимо направить письменный запрос на адрес электронной почты <b>strengthsacademy.ru@gmail.com</b>.
                </p>

                <h3 className="text-xl font-black uppercase italic tracking-tight text-brand-dark pt-4">5. Изменение политики</h3>
                <p>
                  Организация сохраняет за собой право на одностороннее изменение настоящей Политики при условии соответствия действующему законодательству Российской Федерации. Актуальная редакция всегда доступна на данной странице.
                </p>

                <p className="pt-4 text-xs text-gray-500 italic">
                  Оставляя свои данные в формах на Сайте, Пользователь подтверждает согласие с настоящей Политикой обработки персональных данных.
                </p>

                <p className="text-xs text-gray-400 pt-2">
                  Контактный email: strengthsacademy.ru@gmail.com<br/>
                  Телефон: +7 926 449-24-09 (Россия), +31 6 5332-2331 (Европа)
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
