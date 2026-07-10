import React, { useState, useEffect } from 'react';
import { CRM_URL, BACKEND_URL } from '../config';
import { Building2, Plus, X, Send, RefreshCw, Trash2, ChevronLeft, Users, KeyRound } from 'lucide-react';

const B2B_PRODUCTS = ['ДНК команды', 'Лидерство через сильные стороны', 'Программа HIPRO', 'Сессия обратной связи', 'Индивидуальные разборы', 'Другое'];
const COMPANY_STATUSES = ['Новая', 'В работе', 'Тестирование', 'Сессии', 'Завершена'];
const STATUS_COLORS = {
  'Новая': 'bg-brand-yellow text-brand-dark',
  'В работе': 'bg-brand-accent text-white',
  'Тестирование': 'bg-orange-400 text-white',
  'Сессии': 'bg-blue-400 text-white',
  'Завершена': 'bg-brand-green text-brand-dark'
};
const P_STATUS_COLORS = {
  'Ожидает код': 'bg-gray-200 text-gray-600',
  'Код отправлен': 'bg-brand-accent text-white',
  'Тест пройден': 'bg-brand-green text-brand-dark'
};

function api(action, params = {}) {
  const url = new URL(CRM_URL);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return fetch(url.toString(), { redirect: 'follow' }).then(r => r.json());
}
function apiPost(body) {
  return fetch(CRM_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
    redirect: 'follow'
  }).then(r => r.json());
}

export default function AdminB2B({ password }) {
  const [companies, setCompanies] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [newCo, setNewCo] = useState({ name: '', hrName: '', hrEmail: '', product: B2B_PRODUCTS[0], notes: '' });

  const [selected, setSelected] = useState(null); // компания
  const [participants, setParticipants] = useState([]);
  const [bulkText, setBulkText] = useState('');
  const [deadline, setDeadline] = useState('');
  const [codeDrafts, setCodeDrafts] = useState({}); // _row -> code
  const [sending, setSending] = useState({});       // _row -> bool
  const [bulkSending, setBulkSending] = useState(false);

  const loadCompanies = async () => {
    setLoading(true);
    setError('');
    const r = await api('b2b_companies', { password }).catch(() => null);
    setLoading(false);
    if (r?.success) {
      setCompanies(r.rows || []);
      setCounts(r.counts || {});
    } else {
      setError(r?.error === 'Unknown action: b2b_companies'
        ? 'CRM-скрипт ещё не обновлён — нужно новое развёртывание Apps Script (см. инструкцию)'
        : (r?.error || 'Не удалось загрузить компании'));
    }
  };

  const loadParticipants = async (co = selected) => {
    if (!co) return;
    const r = await api('b2b_participants', { password, companyId: co['ID'] }).catch(() => null);
    if (r?.success) setParticipants(r.rows || []);
  };

  useEffect(() => { loadCompanies(); }, []);
  useEffect(() => { if (selected) { setParticipants([]); loadParticipants(selected); } }, [selected?.['ID']]);

  const createCompany = async () => {
    if (!newCo.name.trim()) return;
    setLoading(true);
    const r = await apiPost({ type: 'b2b_create_company', password, ...newCo }).catch(() => null);
    setLoading(false);
    if (r?.success) {
      setCreateOpen(false);
      setNewCo({ name: '', hrName: '', hrEmail: '', product: B2B_PRODUCTS[0], notes: '' });
      loadCompanies();
    }
  };

  const addBulk = async () => {
    // Формат: «Имя; email» или «Имя<TAB>email» или «Имя, email» — по одному в строке
    const list = bulkText.split(/\r?\n/).map(line => {
      const parts = line.split(/[;,\t]/).map(s => s.trim()).filter(Boolean);
      if (parts.length === 0) return null;
      const emailIdx = parts.findIndex(p => p.includes('@'));
      if (emailIdx < 0) return null;
      const email = parts[emailIdx];
      const name = parts.filter((_, i) => i !== emailIdx).join(' ');
      return { name, email };
    }).filter(Boolean);
    if (list.length === 0) return;
    setLoading(true);
    const r = await apiPost({ type: 'b2b_add_participants', password, companyId: selected['ID'], participants: list }).catch(() => null);
    setLoading(false);
    if (r?.success) {
      setBulkText('');
      loadParticipants();
      loadCompanies();
    }
  };

  const saveCode = async (p, code) => {
    await apiPost({ type: 'b2b_edit_participant', password, row: p._row, field: 'Код', value: code });
  };

  const sendOne = async (p) => {
    const code = (codeDrafts[p._row] ?? p['Код'] ?? '').trim();
    if (!code || !p['Email']) return { ok: false };
    setSending(s => ({ ...s, [p._row]: true }));
    try {
      // Код мог быть изменён в поле — фиксируем в таблице перед отправкой
      if (code !== p['Код']) await saveCode(p, code);
      const resp = await fetch(`${BACKEND_URL}/send-codes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, email: p['Email'], name: p['Имя'], codes: code, deadline: deadline.trim() || undefined })
      });
      const data = await resp.json();
      if (data.ok) {
        await apiPost({ type: 'b2b_mark_sent', password, row: p._row });
        return { ok: true };
      }
      return { ok: false };
    } catch {
      return { ok: false };
    } finally {
      setSending(s => ({ ...s, [p._row]: false }));
    }
  };

  const sendOneAndRefresh = async (p) => {
    await sendOne(p);
    await loadParticipants();
    loadCompanies();
  };

  const sendAll = async () => {
    setBulkSending(true);
    const pending = participants.filter(p =>
      p['Статус'] !== 'Код отправлен' && p['Статус'] !== 'Тест пройден' &&
      ((codeDrafts[p._row] ?? p['Код'] ?? '').trim())
    );
    for (const p of pending) {
      await sendOne(p); // последовательно, чтобы не упереться в лимиты
    }
    setBulkSending(false);
    await loadParticipants();
    loadCompanies();
  };

  // ===== Детали компании =====
  if (selected) {
    const readyToSend = participants.filter(p =>
      p['Статус'] !== 'Код отправлен' && p['Статус'] !== 'Тест пройден' &&
      ((codeDrafts[p._row] ?? p['Код'] ?? '').trim())
    ).length;

    return (
      <div className="space-y-4">
        <button onClick={() => { setSelected(null); loadCompanies(); }} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-accent hover:text-brand-dark">
          <ChevronLeft size={14} /> Все компании
        </button>

        <div className="bg-white rounded-2xl p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent mb-1">{selected['Продукт'] || 'B2B'}</div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-brand-dark">{selected['Название']}</h2>
              <div className="text-sm text-gray-500 mt-1">
                {selected['Контакт HR'] && <span>{selected['Контакт HR']}</span>}
                {selected['Email HR'] && <span> · {selected['Email HR']}</span>}
              </div>
            </div>
            <select
              value={selected['Статус'] || 'Новая'}
              onChange={async e => {
                await apiPost({ type: 'b2b_edit_company', password, row: selected._row, field: 'Статус', value: e.target.value });
                setSelected({ ...selected, 'Статус': e.target.value });
              }}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-0 focus:outline-none cursor-pointer ${STATUS_COLORS[selected['Статус']] || 'bg-gray-200'}`}
            >
              {COMPANY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Добавление участников списком */}
          <div className="bg-brand-light rounded-2xl p-4 mb-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-brand-dark/60 mb-2">Добавить участников (вставьте из Excel)</div>
            <textarea
              value={bulkText}
              onChange={e => setBulkText(e.target.value)}
              rows={3}
              placeholder={'По одному участнику в строке: Имя; email\nИван Петров; ivan@company.ru\nАнна Сидорова; anna@company.ru'}
              className="w-full bg-white rounded-xl px-4 py-3 text-sm font-mono text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
            <button
              onClick={addBulk}
              disabled={!bulkText.trim() || loading}
              className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-brand-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-accent disabled:opacity-50"
            >
              <Plus size={13} /> Добавить в список
            </button>
          </div>

          {/* Дедлайн и массовая отправка */}
          <div className="flex flex-col md:flex-row gap-3 mb-4 md:items-center">
            <input
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              placeholder="Дедлайн для письма, напр.: 20 июля 2026 (необязательно)"
              className="flex-grow bg-brand-light rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
            <button
              onClick={sendAll}
              disabled={bulkSending || readyToSend === 0}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-dark disabled:opacity-50"
            >
              <Send size={13} /> {bulkSending ? 'Отправляю…' : `Отправить коды всем (${readyToSend})`}
            </button>
          </div>

          {/* Таблица участников */}
          <div className="space-y-2">
            {participants.length === 0 && (
              <div className="text-center text-gray-400 text-sm py-8">Участников пока нет — вставьте список выше</div>
            )}
            {participants.map(p => (
              <div key={p._row} className="flex flex-col md:flex-row md:items-center gap-2 bg-brand-light rounded-xl p-3">
                <div className="md:w-48 shrink-0">
                  <div className="font-bold text-sm text-brand-dark truncate">{p['Имя'] || '—'}</div>
                  <div className="text-xs text-gray-500 truncate">{p['Email']}</div>
                </div>
                <input
                  value={codeDrafts[p._row] ?? p['Код'] ?? ''}
                  onChange={e => setCodeDrafts(d => ({ ...d, [p._row]: e.target.value }))}
                  onBlur={e => { if (e.target.value !== p['Код']) saveCode(p, e.target.value.trim()); }}
                  placeholder="Код доступа Gallup"
                  className="flex-grow bg-white rounded-lg px-3 py-2 text-xs font-mono text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                />
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${P_STATUS_COLORS[p['Статус']] || 'bg-gray-200 text-gray-600'}`}>
                    {p['Статус'] || '—'}
                  </span>
                  <button
                    onClick={() => sendOneAndRefresh(p)}
                    disabled={sending[p._row] || !(codeDrafts[p._row] ?? p['Код'] ?? '').trim()}
                    title="Отправить код этому участнику"
                    className="p-2 bg-brand-dark text-white rounded-lg hover:bg-brand-accent disabled:opacity-40"
                  >
                    <Send size={13} className={sending[p._row] ? 'animate-pulse' : ''} />
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm('Удалить участника?')) return;
                      await apiPost({ type: 'b2b_delete_participant', password, row: p._row });
                      loadParticipants();
                      loadCompanies();
                    }}
                    className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {participants.some(p => p['Дата отправки']) && (
            <div className="text-[10px] text-gray-400 mt-3">
              Повторная отправка: впишите код и нажмите ✈ у участника — статус обновится по последней отправке.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== Список компаний =====
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCreateOpen(!createOpen)}
          className="flex items-center gap-2 px-5 py-3 bg-brand-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-accent"
        >
          {createOpen ? <X size={13} /> : <Plus size={13} />} {createOpen ? 'Отмена' : 'Новая компания'}
        </button>
        <button onClick={loadCompanies} className="p-3 bg-white rounded-xl hover:shadow-md">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && <div className="bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold rounded-xl p-4">{error}</div>}

      {createOpen && (
        <div className="bg-white rounded-2xl p-5 space-y-3">
          <input value={newCo.name} onChange={e => setNewCo({ ...newCo, name: e.target.value })} placeholder="Название компании *"
            className="w-full bg-brand-light rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
          <div className="grid md:grid-cols-2 gap-3">
            <input value={newCo.hrName} onChange={e => setNewCo({ ...newCo, hrName: e.target.value })} placeholder="Контакт (HR / ЛПР)"
              className="bg-brand-light rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
            <input value={newCo.hrEmail} onChange={e => setNewCo({ ...newCo, hrEmail: e.target.value })} placeholder="Email контакта"
              className="bg-brand-light rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
          </div>
          <select value={newCo.product} onChange={e => setNewCo({ ...newCo, product: e.target.value })}
            className="w-full bg-brand-light rounded-xl px-4 py-3 text-sm font-bold text-brand-dark focus:outline-none">
            {B2B_PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <textarea value={newCo.notes} onChange={e => setNewCo({ ...newCo, notes: e.target.value })} rows={2} placeholder="Заметки"
            className="w-full bg-brand-light rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
          <button onClick={createCompany} disabled={!newCo.name.trim() || loading}
            className="w-full py-3 bg-brand-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-dark disabled:opacity-50">
            Создать компанию
          </button>
        </div>
      )}

      <div className="space-y-2">
        {companies.length === 0 && !error && (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 font-medium">
            {loading ? 'Загружаю…' : 'Пока нет корпоративных клиентов — создайте первую компанию'}
          </div>
        )}
        {companies.map(c => {
          const cnt = counts[c['ID']] || { total: 0, sent: 0 };
          return (
            <div key={c._row} onClick={() => setSelected(c)}
              className="bg-white rounded-2xl p-4 md:p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center text-brand-dark shrink-0">
                  <Building2 size={18} />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[c['Статус']] || 'bg-gray-200 text-gray-600'}`}>
                      {c['Статус'] || '—'}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/50">{c['Продукт'] || '—'}</span>
                    <span className="text-[10px] text-gray-400">{c['Дата']}</span>
                  </div>
                  <div className="font-black text-brand-dark truncate">{c['Название']}</div>
                  {c['Контакт HR'] && <div className="text-sm text-gray-500 truncate">{c['Контакт HR']}{c['Email HR'] ? ` · ${c['Email HR']}` : ''}</div>}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 shrink-0">
                  <span className="flex items-center gap-1.5"><Users size={13} /> {cnt.total}</span>
                  <span className="flex items-center gap-1.5"><KeyRound size={13} /> {cnt.sent}/{cnt.total}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
