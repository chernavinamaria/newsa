import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CRM_URL, BACKEND_URL } from '../config';
import { Lock, LogOut, RefreshCw, Search, Filter, Trash2, Edit3, Save, X, TrendingUp, Users, Calendar, Mail, MessageSquare, Send, KeyRound } from 'lucide-react';

const STATUSES = ['Новая', 'В работе', 'Ожидает оплаты', 'Оплачено', 'Закрыто', 'Отказ'];
const STATUS_COLORS = {
  'Новая': 'bg-brand-yellow text-brand-dark',
  'В работе': 'bg-brand-accent text-white',
  'Ожидает оплаты': 'bg-orange-400 text-white',
  'Оплачено': 'bg-brand-green text-brand-dark',
  'Закрыто': 'bg-gray-400 text-white',
  'Отказ': 'bg-red-400 text-white'
};

const STORAGE_KEY = 'sa_admin_password';

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

export default function Admin() {
  const [password, setPassword] = useState(localStorage.getItem(STORAGE_KEY) || '');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selected, setSelected] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Отправка кодов Gallup из карточки заявки
  const [codesOpen, setCodesOpen] = useState(false);
  const [codesEmail, setCodesEmail] = useState('');
  const [codesName, setCodesName] = useState('');
  const [codesText, setCodesText] = useState('');
  const [codesStatus, setCodesStatus] = useState('idle'); // idle | sending | sent | error
  const [codesError, setCodesError] = useState('');

  const openCodesPanel = (lead) => {
    // Контакт бывает "email / телефон" — вытаскиваем email
    const emailMatch = String(lead.Контакт || '').match(/[^\s@\/]+@[^\s@\/]+\.[^\s@\/]+/);
    setCodesEmail(emailMatch ? emailMatch[0] : '');
    setCodesName(lead.Имя && lead.Имя !== '—' ? lead.Имя : '');
    setCodesText('');
    setCodesStatus('idle');
    setCodesError('');
    setCodesOpen(true);
  };

  const sendCodes = async () => {
    setCodesStatus('sending');
    setCodesError('');
    try {
      const resp = await fetch(`${BACKEND_URL}/send-codes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, email: codesEmail.trim(), name: codesName.trim(), codes: codesText })
      });
      const data = await resp.json();
      if (!data.ok) {
        setCodesStatus('error');
        setCodesError(data.error || 'Не удалось отправить');
        return;
      }
      setCodesStatus('sent');
      // Фиксируем факт отправки в заметках заявки
      const stamp = new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
      const note = `${selected.Заметки ? selected.Заметки + ' | ' : ''}Коды отправлены ${stamp} → ${codesEmail.trim()}`;
      await apiPost({ type: 'admin_edit', password, row: selected._row, field: 'Заметки', value: note });
      setSelected({ ...selected, Заметки: note });
      loadLeads();
    } catch {
      setCodesStatus('error');
      setCodesError('Ошибка сети');
    }
  };

  useEffect(() => {
    if (password && !loggedIn) tryLogin(password, true);
  }, []);

  const tryLogin = async (pw, silent) => {
    setLoading(true);
    setLoginError('');
    const r = await api('admin_verify', { password: pw }).catch(() => ({ error: 'сеть' }));
    setLoading(false);
    if (r.success) {
      setLoggedIn(true);
      localStorage.setItem(STORAGE_KEY, pw);
      loadLeads(pw);
      loadStats(pw);
    } else if (!silent) {
      setLoginError(r.error || 'Ошибка входа');
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setPassword('');
    localStorage.removeItem(STORAGE_KEY);
  };

  const loadLeads = async (pw = password) => {
    setLoading(true);
    const r = await api('admin_leads', { password: pw }).catch(() => ({ error: 'сеть' }));
    setLoading(false);
    if (r.success) setLeads(r.rows || []);
  };

  const loadStats = async (pw = password) => {
    const r = await api('admin_stats', { password: pw }).catch(() => null);
    if (r?.success) setStats(r.stats);
  };

  const updateField = async (row, field, value) => {
    setLoading(true);
    await apiPost({ type: 'admin_edit', password, row, field, value });
    setLoading(false);
    setEditingField(null);
    loadLeads();
  };

  const deleteLead = async (row) => {
    if (!confirm('Удалить эту заявку?')) return;
    setLoading(true);
    await apiPost({ type: 'admin_delete', password, row });
    setLoading(false);
    setSelected(null);
    loadLeads();
    loadStats();
  };

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (filterStatus !== 'all' && l.Статус !== filterStatus) return false;
      if (filterType !== 'all' && l.Тип !== filterType) return false;
      if (search) {
        const s = search.toLowerCase();
        return String(l.Имя || '').toLowerCase().includes(s)
          || String(l.Контакт || '').toLowerCase().includes(s)
          || String(l.Источник || '').toLowerCase().includes(s)
          || String(l.Заметки || '').toLowerCase().includes(s);
      }
      return true;
    });
  }, [leads, filterStatus, filterType, search]);

  const uniqueTypes = useMemo(() => {
    const set = new Set(leads.map(l => l.Тип).filter(Boolean));
    return Array.from(set);
  }, [leads]);

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark px-6">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={(e) => { e.preventDefault(); tryLogin(password); }}
          className="w-full max-w-md bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center text-brand-dark font-black italic">SA</div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent">Admin</div>
              <div className="text-xl font-black uppercase italic tracking-tighter text-brand-dark">Панель заявок</div>
            </div>
          </div>
          <label className="block text-xs font-black uppercase tracking-widest text-brand-dark/60 mb-2">Пароль</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              autoFocus
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Введите пароль администратора"
              className="w-full bg-brand-light border-2 border-transparent focus:border-brand-yellow rounded-2xl pl-12 pr-4 py-4 text-brand-dark placeholder:text-gray-400 focus:outline-none transition-colors"
            />
          </div>
          {loginError && <p className="text-red-500 text-sm mt-3">{loginError}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full mt-6 py-4 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest hover:bg-brand-accent transition-colors shadow-xl disabled:opacity-60"
          >
            {loading ? 'Проверяю...' : 'Войти'}
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Top bar */}
      <div className="bg-brand-dark text-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-yellow rounded-lg flex items-center justify-center text-brand-dark font-black italic">SA</div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-yellow">Admin</div>
              <div className="text-sm font-black uppercase italic">CRM · Заявки</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { loadLeads(); loadStats(); }} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={logout} className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-colors">
              <LogOut size={14} /> Выйти
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <StatCard icon={<TrendingUp size={16} />} label="Всего" value={stats.total} color="bg-brand-dark text-white" />
            <StatCard icon={<Calendar size={16} />} label="За 7 дней" value={stats.last7days} color="bg-brand-accent text-white" />
            <StatCard icon={<Calendar size={16} />} label="За 30 дней" value={stats.last30days} color="bg-brand-green text-brand-dark" />
            <StatCard icon={<Users size={16} />} label="Новых" value={stats.byStatus?.['Новая'] || 0} color="bg-brand-yellow text-brand-dark" />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 mb-4 flex flex-col md:flex-row gap-3">
          <div className="flex-grow relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по имени, контакту, источнику…"
              className="w-full bg-brand-light border-2 border-transparent focus:border-brand-yellow rounded-xl pl-11 pr-4 py-3 text-brand-dark placeholder:text-gray-400 focus:outline-none transition-colors text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-brand-light border-2 border-transparent focus:border-brand-yellow rounded-xl px-4 py-3 text-sm font-bold text-brand-dark focus:outline-none"
          >
            <option value="all">Все статусы</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-brand-light border-2 border-transparent focus:border-brand-yellow rounded-xl px-4 py-3 text-sm font-bold text-brand-dark focus:outline-none"
          >
            <option value="all">Все типы</option>
            {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Leads list */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400 font-medium">
              {leads.length === 0 ? 'Пока нет заявок' : 'Ничего не найдено под фильтры'}
            </div>
          )}
          {filtered.map(l => (
            <div
              key={l._row}
              className="bg-white rounded-2xl p-4 md:p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => { setSelected(l); setCodesOpen(false); }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[l.Статус] || 'bg-gray-200 text-gray-600'}`}>
                      {l.Статус || '—'}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/50">{l.Тип || '—'}</span>
                    <span className="text-[10px] text-gray-400">{l.Дата || ''}</span>
                  </div>
                  <div className="font-black text-brand-dark truncate">{l.Имя || '—'}</div>
                  <div className="text-sm text-gray-500 truncate flex items-center gap-2">
                    {l.Контакт?.includes('@') ? <Mail size={12} /> : <MessageSquare size={12} />}
                    {l.Контакт || '—'}
                  </div>
                </div>
                <div className="text-xs text-gray-400 md:text-right">
                  {l.Источник && <div className="italic truncate">{l.Источник}</div>}
                  {l.Заметки && <div className="italic text-gray-500 truncate max-w-xs">💬 {l.Заметки.substring(0, 40)}{l.Заметки.length > 40 ? '…' : ''}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="absolute inset-0 bg-brand-dark/70 backdrop-blur-sm" onClick={() => { setSelected(null); setEditingField(null); }} />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full md:max-w-2xl md:max-h-[85vh] bg-white rounded-t-[2rem] md:rounded-[2rem] shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-brand-light p-4 md:p-6 flex items-center justify-between z-10">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent">Заявка</div>
                <div className="text-lg font-black uppercase italic tracking-tighter text-brand-dark">{selected.Имя || '—'}</div>
              </div>
              <button onClick={() => { setSelected(null); setEditingField(null); }} className="p-2 bg-brand-light hover:bg-gray-200 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <FieldRow label="Дата" value={selected.Дата} />
              <FieldRow label="Тип" value={selected.Тип} />
              <FieldRow label="Контакт" value={selected.Контакт} />
              <FieldRow label="Источник" value={selected.Источник} />

              {/* Status dropdown */}
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-brand-dark/50 mb-2">Статус</div>
                <select
                  value={selected.Статус || 'Новая'}
                  onChange={e => {
                    updateField(selected._row, 'Статус', e.target.value);
                    setSelected({ ...selected, Статус: e.target.value });
                  }}
                  className="w-full bg-brand-light border-2 border-transparent focus:border-brand-yellow rounded-xl px-4 py-3 text-brand-dark font-bold focus:outline-none"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Responsible */}
              <EditableField
                label="Ответственный"
                value={selected.Ответственный}
                onSave={(v) => { updateField(selected._row, 'Ответственный', v); setSelected({ ...selected, Ответственный: v }); }}
                editing={editingField === 'Ответственный'}
                setEditing={() => setEditingField('Ответственный')}
                editValue={editValue}
                setEditValue={setEditValue}
                cancel={() => setEditingField(null)}
              />

              {/* Notes */}
              <EditableField
                label="Заметки"
                value={selected.Заметки}
                onSave={(v) => { updateField(selected._row, 'Заметки', v); setSelected({ ...selected, Заметки: v }); }}
                editing={editingField === 'Заметки'}
                setEditing={() => setEditingField('Заметки')}
                editValue={editValue}
                setEditValue={setEditValue}
                cancel={() => setEditingField(null)}
                multiline
              />

              {selected['Метапрограммы (JSON)'] && (
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-brand-dark/50 mb-2">Метапрограммы</div>
                  <div className="bg-brand-light rounded-xl p-3 text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(selected['Метапрограммы (JSON)']), null, 2);
                      } catch {
                        return selected['Метапрограммы (JSON)'];
                      }
                    })()}
                  </div>
                </div>
              )}

              {/* Отправка кодов Gallup */}
              <div className="pt-4 border-t border-brand-light">
                {!codesOpen ? (
                  <button
                    onClick={() => openCodesPanel(selected)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-dark hover:bg-brand-accent text-white rounded-xl font-black uppercase tracking-widest text-xs transition-colors"
                  >
                    <KeyRound size={14} /> Отправить коды Gallup
                  </button>
                ) : (
                  <div className="bg-brand-light rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-black uppercase tracking-widest text-brand-dark/60">Отправка кодов Gallup</div>
                      <button onClick={() => setCodesOpen(false)} className="p-1 text-gray-400 hover:text-brand-dark"><X size={16} /></button>
                    </div>
                    {codesStatus === 'sent' ? (
                      <div className="py-4 text-center">
                        <div className="text-brand-green font-black uppercase tracking-widest text-sm mb-1">✓ Отправлено</div>
                        <div className="text-xs text-gray-500">Письмо с кодами ушло на {codesEmail}</div>
                      </div>
                    ) : (
                      <>
                        <input
                          type="email"
                          value={codesEmail}
                          onChange={e => setCodesEmail(e.target.value)}
                          placeholder="Email клиента *"
                          className="w-full bg-white border-2 border-transparent focus:border-brand-yellow rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none"
                        />
                        <input
                          value={codesName}
                          onChange={e => setCodesName(e.target.value)}
                          placeholder="Имя клиента (для обращения в письме)"
                          className="w-full bg-white border-2 border-transparent focus:border-brand-yellow rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none"
                        />
                        <textarea
                          value={codesText}
                          onChange={e => setCodesText(e.target.value)}
                          rows={3}
                          placeholder={'Коды доступа — по одному в строке\nНапример:\nABCD-EFGH-IJKL'}
                          className="w-full bg-white border-2 border-transparent focus:border-brand-yellow rounded-xl px-4 py-3 text-sm font-mono text-brand-dark focus:outline-none"
                        />
                        {codesError && <div className="text-xs font-bold text-red-500">{codesError}</div>}
                        <button
                          onClick={sendCodes}
                          disabled={codesStatus === 'sending' || !codesEmail.trim() || !codesText.trim()}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-brand-accent hover:bg-brand-dark text-white rounded-xl font-black uppercase tracking-widest text-xs transition-colors disabled:opacity-50"
                        >
                          <Send size={14} /> {codesStatus === 'sending' ? 'Отправляю…' : 'Отправить письмо с кодами'}
                        </button>
                        <div className="text-[10px] text-gray-400 leading-relaxed">
                          Клиент получит брендовое письмо с {'кодом(ами)'} и инструкцией по активации на gallup.com/access. Факт отправки запишется в заметки заявки.
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-brand-light flex gap-3">
                <button
                  onClick={() => deleteLead(selected._row)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-black uppercase tracking-widest text-xs"
                >
                  <Trash2 size={14} /> Удалить
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`rounded-2xl p-4 ${color}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{label}</span>
        {icon}
      </div>
      <div className="text-3xl font-black italic tracking-tight">{value}</div>
    </div>
  );
}

function FieldRow({ label, value }) {
  return (
    <div>
      <div className="text-[10px] font-black uppercase tracking-widest text-brand-dark/50 mb-1">{label}</div>
      <div className="text-sm text-brand-dark font-medium break-all">{value || '—'}</div>
    </div>
  );
}

function EditableField({ label, value, onSave, editing, setEditing, editValue, setEditValue, cancel, multiline }) {
  return (
    <div>
      <div className="text-[10px] font-black uppercase tracking-widest text-brand-dark/50 mb-2 flex items-center justify-between">
        {label}
        {!editing && (
          <button onClick={() => { setEditValue(value || ''); setEditing(); }} className="text-brand-accent hover:text-brand-dark">
            <Edit3 size={12} />
          </button>
        )}
      </div>
      {editing ? (
        <div className="flex gap-2">
          {multiline ? (
            <textarea
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              rows={3}
              className="flex-grow bg-brand-light border-2 border-brand-yellow rounded-xl px-3 py-2 text-sm text-brand-dark focus:outline-none"
            />
          ) : (
            <input
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              className="flex-grow bg-brand-light border-2 border-brand-yellow rounded-xl px-3 py-2 text-sm text-brand-dark focus:outline-none"
            />
          )}
          <button onClick={() => onSave(editValue)} className="px-3 bg-brand-dark text-white rounded-xl">
            <Save size={14} />
          </button>
          <button onClick={cancel} className="px-3 bg-brand-light text-brand-dark rounded-xl">
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="text-sm text-brand-dark font-medium bg-brand-light rounded-xl p-3 min-h-[44px]">
          {value || <span className="text-gray-400 italic">—</span>}
        </div>
      )}
    </div>
  );
}
