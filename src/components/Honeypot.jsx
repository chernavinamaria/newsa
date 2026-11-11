import React from 'react';

// Поле-ловушка против спам-ботов. Человек его не видит и не может в него попасть
// с клавиатуры, а бот, который заполняет все поля подряд, заполняет и его.
// Заполнено = заявку никуда не отправляем, но показываем «отправлено»,
// чтобы бот не узнал, что его отсеяли. Серверы проверяют это же поле сами.
export const TRAP_FIELD = 'comment2';

// Значение читается прямо из формы: так ловится и бот, который пишет в поле в обход React
export function trapValue(formEl) {
  try {
    const el = formEl && formEl.elements ? formEl.elements[TRAP_FIELD] : null;
    return el && typeof el.value === 'string' ? el.value.trim() : '';
  } catch {
    return '';
  }
}

export default function Honeypot() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}
    >
      <label>
        Комментарий (не заполняйте это поле)
        <input type="text" name={TRAP_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
