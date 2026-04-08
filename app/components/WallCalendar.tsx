'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type ThemeKey  = 'aurora' | 'rose' | 'ocean' | 'forest';
type VacType   = 'beach' | 'mountain' | 'city' | 'roadtrip' | 'family' | 'work' | 'adventure' | 'cruise';
type RightTab  = 'vacation' | 'notes';

interface Vacation {
  id: string;
  name: string;
  type: VacType;
  start: string;   // 'YYYY-MM-DD'
  end: string;     // 'YYYY-MM-DD'
  note: string;
  createdAt: string;
}

interface Note {
  id: string;
  text: string;
  createdAt: string;
}

interface Theme {
  name: string; emoji: string;
  blob1: string; blob2: string; blob3: string;
  glassBorder: string; glassBg: string;
  primary: string; primaryRgb: string; secondary: string;
  textBright: string; textMid: string; textDim: string;
  startGrad: string; endGrad: string; rangeColor: string;
  btnGrad: string; btnShadow: string;
  noteCard: string;
  inputBorder: string; inputFocusBorder: string; inputFocusShadow: string;
}


const VAC_TYPES: Record<VacType, { label: string; emoji: string; color: string; bg: string; grad: string }> = {
  beach:    { label:'Beach',     emoji:'🏖️', color:'#22d3ee', bg:'rgba(6,182,212,0.12)',   grad:'linear-gradient(135deg,#0891b2,#22d3ee)' },
  mountain: { label:'Mountain',  emoji:'🏔️', color:'#818cf8', bg:'rgba(129,140,248,0.12)', grad:'linear-gradient(135deg,#4f46e5,#818cf8)' },
  city:     { label:'City',      emoji:'🏙️', color:'#fbbf24', bg:'rgba(251,191,36,0.12)',  grad:'linear-gradient(135deg,#d97706,#fbbf24)' },
  roadtrip: { label:'Road Trip', emoji:'🚗', color:'#34d399', bg:'rgba(52,211,153,0.12)',  grad:'linear-gradient(135deg,#059669,#34d399)' },
  family:   { label:'Family',    emoji:'👨‍👩‍👧', color:'#f472b6', bg:'rgba(244,114,182,0.12)', grad:'linear-gradient(135deg,#db2777,#f472b6)' },
  work:     { label:'Work Trip', emoji:'💼', color:'#94a3b8', bg:'rgba(148,163,184,0.12)', grad:'linear-gradient(135deg,#475569,#94a3b8)' },
  adventure:{ label:'Adventure', emoji:'🧗', color:'#fb923c', bg:'rgba(251,146,60,0.12)',  grad:'linear-gradient(135deg,#ea580c,#fb923c)' },
  cruise:   { label:'Cruise',    emoji:'🚢', color:'#38bdf8', bg:'rgba(56,189,248,0.12)',  grad:'linear-gradient(135deg,#0284c7,#38bdf8)' },
};

const THEMES: Record<ThemeKey, Theme> = {
  aurora: {
    name:'Aurora', emoji:'🌌',
    blob1:'#7c3aed', blob2:'#2563eb', blob3:'#0891b2',
    glassBorder:'rgba(139,92,246,0.28)', glassBg:'rgba(12,8,35,0.72)',
    primary:'#a78bfa', primaryRgb:'167,139,250', secondary:'#c4b5fd',
    textBright:'#f5f3ff', textMid:'rgba(196,181,253,0.85)', textDim:'rgba(167,139,250,0.45)',
    startGrad:'linear-gradient(135deg,#4f46e5,#7c3aed)', endGrad:'linear-gradient(135deg,#dc2626,#f43f5e)',
    rangeColor:'rgba(139,92,246,0.14)',
    btnGrad:'linear-gradient(135deg,#6d28d9,#a78bfa)', btnShadow:'0 8px 32px rgba(139,92,246,0.55)',
    noteCard:'rgba(139,92,246,0.09)',
    inputBorder:'rgba(139,92,246,0.25)', inputFocusBorder:'#a78bfa', inputFocusShadow:'0 0 0 3px rgba(167,139,250,0.18)',
  },
  rose: {
    name:'Rose', emoji:'🌹',
    blob1:'#be123c', blob2:'#e11d48', blob3:'#f97316',
    glassBorder:'rgba(244,63,94,0.28)', glassBg:'rgba(25,4,12,0.72)',
    primary:'#fb7185', primaryRgb:'251,113,133', secondary:'#fda4af',
    textBright:'#fff1f2', textMid:'rgba(253,164,175,0.85)', textDim:'rgba(251,113,133,0.45)',
    startGrad:'linear-gradient(135deg,#9f1239,#e11d48)', endGrad:'linear-gradient(135deg,#c2410c,#f97316)',
    rangeColor:'rgba(244,63,94,0.14)',
    btnGrad:'linear-gradient(135deg,#be123c,#fb7185)', btnShadow:'0 8px 32px rgba(244,63,94,0.55)',
    noteCard:'rgba(244,63,94,0.09)',
    inputBorder:'rgba(244,63,94,0.25)', inputFocusBorder:'#fb7185', inputFocusShadow:'0 0 0 3px rgba(251,113,133,0.18)',
  },
  ocean: {
    name:'Ocean', emoji:'🌊',
    blob1:'#0c4a6e', blob2:'#0369a1', blob3:'#0891b2',
    glassBorder:'rgba(56,189,248,0.28)', glassBg:'rgba(2,12,26,0.72)',
    primary:'#38bdf8', primaryRgb:'56,189,248', secondary:'#7dd3fc',
    textBright:'#f0f9ff', textMid:'rgba(125,211,252,0.85)', textDim:'rgba(56,189,248,0.45)',
    startGrad:'linear-gradient(135deg,#075985,#0284c7)', endGrad:'linear-gradient(135deg,#0f766e,#14b8a6)',
    rangeColor:'rgba(56,189,248,0.14)',
    btnGrad:'linear-gradient(135deg,#0369a1,#38bdf8)', btnShadow:'0 8px 32px rgba(56,189,248,0.55)',
    noteCard:'rgba(56,189,248,0.09)',
    inputBorder:'rgba(56,189,248,0.25)', inputFocusBorder:'#38bdf8', inputFocusShadow:'0 0 0 3px rgba(56,189,248,0.18)',
  },
  forest: {
    name:'Forest', emoji:'🌿',
    blob1:'#14532d', blob2:'#166534', blob3:'#15803d',
    glassBorder:'rgba(74,222,128,0.28)', glassBg:'rgba(2,15,8,0.72)',
    primary:'#4ade80', primaryRgb:'74,222,128', secondary:'#86efac',
    textBright:'#f0fdf4', textMid:'rgba(134,239,172,0.85)', textDim:'rgba(74,222,128,0.45)',
    startGrad:'linear-gradient(135deg,#14532d,#16a34a)', endGrad:'linear-gradient(135deg,#854d0e,#ca8a04)',
    rangeColor:'rgba(74,222,128,0.12)',
    btnGrad:'linear-gradient(135deg,#15803d,#4ade80)', btnShadow:'0 8px 32px rgba(74,222,128,0.48)',
    noteCard:'rgba(74,222,128,0.07)',
    inputBorder:'rgba(74,222,128,0.25)', inputFocusBorder:'#4ade80', inputFocusShadow:'0 0 0 3px rgba(74,222,128,0.18)',
  },
};

const MONTH_IMAGES: Record<number, string> = {
  0: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=900&q=85',
  1: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=900&q=85',
  2: 'https://images.unsplash.com/photo-1490750967868-88df5691cc4f?w=900&q=85',
  3: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=900&q=85',
  4: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=85',
  5: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85',
  6: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&q=85',
  7: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=900&q=85',
  8: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=900&q=85',
  9: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85',
  10:'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=900&q=85',
  11:'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=900&q=85',
};

const HOLIDAYS: Record<string, { label: string; emoji: string }> = {
  '01-01': { label:"New Year's Day",   emoji:'🎆' },
  '02-14': { label:"Valentine's Day",  emoji:'💝' },
  '03-17': { label:"St. Patrick's",    emoji:'☘️' },
  '05-26': { label:'Memorial Day',     emoji:'🏅' },
  '07-04': { label:'Independence Day', emoji:'🎇' },
  '09-01': { label:'Labor Day',        emoji:'👷' },
  '10-31': { label:'Halloween',        emoji:'🎃' },
  '11-11': { label:'Veterans Day',     emoji:'🎖️' },
  '11-27': { label:'Thanksgiving',     emoji:'🦃' },
  '12-25': { label:'Christmas',        emoji:'🎄' },
  '12-31': { label:"New Year's Eve",   emoji:'🥂' },
};

const MONTHS       = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS_FULL    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const DAYS_SHORT   = ['S','M','T','W','T','F','S'];

const VAC_STORE    = 'wall_cal_vacations_v3';
const noteKey      = (s: string, e: string) => `wall_cal_notes_${s}_${e}`;
const toISO      = (d: Date)   => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const fromISO    = (s: string) => new Date(s + 'T00:00:00');
const sameDay    = (a: Date, b: Date) => toISO(a) === toISO(b);
const daysBetween= (a: Date, b: Date) => Math.round(Math.abs(b.getTime()-a.getTime())/86400000);
const isBetween  = (d: Date, a: Date, b: Date) => {
  const t = d.getTime();
  return t > Math.min(a.getTime(), b.getTime()) && t < Math.max(a.getTime(), b.getTime());
};
const hKey = (d: Date) =>
  `${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const fmtShort = (iso: string) =>
  fromISO(iso).toLocaleDateString('en-US',{month:'short',day:'numeric'});
const fmtLong = (iso: string) =>
  fromISO(iso).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});

function vacsOnDate(vacations: Vacation[], date: Date): Vacation[] {
  const iso = toISO(date);
  return vacations.filter(v => iso >= v.start && iso <= v.end);
}

function AuroraBackground({ theme }: { theme: Theme }) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{ background: '#04040f' }} />
      {[
        { color: theme.blob1, size: 750, left: '-15%', top: '-20%', dur: 20 },
        { color: theme.blob2, size: 640, left: '55%',  top: '5%',   dur: 25 },
        { color: theme.blob3, size: 520, left: '15%',  top: '55%',  dur: 18 },
      ].map((b, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{
            width: b.size, height: b.size,
            left: b.left, top: b.top,
            background: `radial-gradient(circle, ${b.color}50 0%, transparent 68%)`,
            filter: 'blur(90px)',
          }}
          animate={{ x: [0, 45, -35, 25, 0], y: [0, -35, 45, -20, 0], scale: [1, 1.1, 0.93, 1.06, 1] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      {/* Star field — deterministic positions so no hydration mismatch */}
      {Array.from({ length: 55 }, (_, i) => ({
        x: ((i * 137.508) % 100).toFixed(2),
        y: ((i * 97.3)    % 100).toFixed(2),
        size: i % 6 === 0 ? 2 : 1,
        dur: 2 + (i % 5),
        delay: i % 7,
      })).map((s, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white"
          style={{ width: s.size, height: s.size, left: `${s.x}%`, top: `${s.y}%`, opacity: 0.12 }}
          animate={{ opacity: [0.04, 0.45, 0.08] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }}
        />
      ))}
    </div>
  );
}

interface Particle { id: number; x: number; y: number; angle: number }
function useParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const fire = useCallback((x: number, y: number) => {
    const p = Array.from({ length: 8 }, (_, i) => ({ id: Date.now() + i, x, y, angle: (i / 8) * Math.PI * 2 }));
    setParticles(prev => [...prev, ...p]);
    setTimeout(() => setParticles(prev => prev.filter(pp => !p.find(q => q.id === pp.id))), 750);
  }, []);
  return { particles, fire };
}

interface ModalProps {
  theme: Theme;
  editing: Vacation | null;
  initialStart: string;
  initialEnd: string;
  onClose: () => void;
  onSave: (data: Omit<Vacation,'id'|'createdAt'>) => void;
}
function VacationModal({ theme, editing, initialStart, initialEnd, onClose, onSave }: ModalProps) {
  const [name,  setName]  = useState(editing?.name  ?? '');
  const [type,  setType]  = useState<VacType>(editing?.type  ?? 'beach');
  const [start, setStart] = useState(editing?.start ?? initialStart);
  const [end,   setEnd]   = useState(editing?.end   ?? initialEnd);
  const [note,  setNote]  = useState(editing?.note  ?? '');

  const durationDays = start && end && start <= end
    ? daysBetween(fromISO(start), fromISO(end)) + 1
    : 0;

  const valid = name.trim() && start && end && start <= end;

  const handleSave = () => {
    if (!valid) return;
    onSave({ name: name.trim(), type, start, end, note });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div
        initial={{ y: 80, scale: 0.94, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 80, scale: 0.94, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="w-full max-w-md rounded-3xl p-6"
        style={{
          background: `linear-gradient(160deg,rgba(10,6,30,0.97) 0%,rgba(20,12,50,0.97) 100%)`,
          border: `1px solid ${theme.glassBorder}`,
          boxShadow: `0 40px 80px rgba(0,0,0,0.75), ${theme.btnShadow}`,
          backdropFilter: 'blur(30px)',
        }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.35rem', fontWeight:700, color:theme.textBright }}>
            {editing ? '✏️ Edit Trip' : '✈️ Plan a Trip'}
          </h2>
          <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }} onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background:'rgba(255,255,255,0.08)', color:theme.textDim }}>
            ✕
          </motion.button>
        </div>

        {/* Trip name */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color:theme.textDim }}>
            Trip Name *
          </label>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. Summer in Santorini…"
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
            style={{
              background:'rgba(255,255,255,0.05)', border:`1.5px solid ${theme.inputBorder}`,
              color:theme.textBright, fontFamily:"'Inter',sans-serif",
            }}
            onFocus={e => { e.currentTarget.style.borderColor=theme.inputFocusBorder; e.currentTarget.style.boxShadow=theme.inputFocusShadow; }}
            onBlur={e  => { e.currentTarget.style.borderColor=theme.inputBorder; e.currentTarget.style.boxShadow='none'; }}
          />
        </div>

        {/* Trip type */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color:theme.textDim }}>
            Trip Type
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(Object.entries(VAC_TYPES) as [VacType, typeof VAC_TYPES[VacType]][]).map(([k, v]) => (
              <motion.button key={k} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
                onClick={() => setType(k)}
                className="flex flex-col items-center gap-1 py-2.5 rounded-2xl text-xs font-semibold"
                style={{
                  background: type===k ? v.bg : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${type===k ? v.color : 'rgba(255,255,255,0.08)'}`,
                  color: type===k ? v.color : theme.textDim,
                  boxShadow: type===k ? `0 4px 14px ${v.color}35` : 'none',
                }}>
                <span className="text-xl">{v.emoji}</span>
                <span style={{ fontSize:'0.62rem' }}>{v.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Date range */}
        <div className="mb-4 flex gap-3">
          {(['Start','End'] as const).map((lbl, li) => (
            <div key={lbl} className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color:theme.textDim }}>
                {lbl} *
              </label>
              <input type="date"
                value={li===0 ? start : end}
                onChange={e => li===0 ? setStart(e.target.value) : setEnd(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl text-sm outline-none"
                style={{
                  background:'rgba(255,255,255,0.05)', border:`1.5px solid ${theme.inputBorder}`,
                  color:theme.textBright, colorScheme:'dark',
                }}
                onFocus={e => { e.currentTarget.style.borderColor=theme.inputFocusBorder; }}
                onBlur={e  => { e.currentTarget.style.borderColor=theme.inputBorder; }}
              />
            </div>
          ))}
        </div>

        {/* Duration preview */}
        <AnimatePresence>
          {durationDays > 0 && (
            <motion.div initial={{ opacity:0, y:6, height:0 }} animate={{ opacity:1, y:0, height:'auto' }}
              exit={{ opacity:0, y:6, height:0 }}
              className="mb-4 px-4 py-2.5 rounded-2xl flex items-center gap-2 overflow-hidden"
              style={{ background:`rgba(${theme.primaryRgb},0.1)`, border:`1px solid rgba(${theme.primaryRgb},0.22)` }}>
              <span>📅</span>
              <span className="text-sm font-semibold" style={{ color:theme.textMid }}>
                {durationDays} day{durationDays>1?'s':''} &nbsp;·&nbsp; {fmtShort(start)} → {fmtShort(end)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes */}
        <div className="mb-5">
          <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color:theme.textDim }}>
            Notes &amp; Details
          </label>
          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder="Flights, hotel, packing list…"
            rows={3} className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
            style={{
              background:'rgba(255,255,255,0.05)', border:`1.5px solid ${theme.inputBorder}`,
              color:theme.textBright, fontFamily:"'Inter',sans-serif",
            }}
            onFocus={e => { e.currentTarget.style.borderColor=theme.inputFocusBorder; e.currentTarget.style.boxShadow=theme.inputFocusShadow; }}
            onBlur={e  => { e.currentTarget.style.borderColor=theme.inputBorder; e.currentTarget.style.boxShadow='none'; }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-all"
            style={{ background:'rgba(255,255,255,0.06)', color:theme.textMid, border:`1px solid rgba(255,255,255,0.1)` }}>
            Cancel
          </button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleSave} disabled={!valid}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background:theme.btnGrad, boxShadow:valid?theme.btnShadow:'none' }}>
            {editing ? '✓ Save Changes' : '✈️ Add Trip'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ icon, label, value, unit, theme }: {
  icon: string; label: string; value: string|number; unit: string; theme: Theme
}) {
  return (
    <motion.div whileHover={{ scale: 1.03, y: -2 }} transition={{ type:'spring', stiffness:300 }}
      className="rounded-2xl p-4 flex items-center gap-3"
      style={{
        background: theme.glassBg,
        border: `1px solid ${theme.glassBorder}`,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
      }}>
      <span className="text-2xl shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-medium truncate" style={{ color:theme.textDim }}>{label}</p>
        <p className="text-xl font-bold leading-tight" style={{ color:theme.textBright }}>
          {value}<span className="text-sm font-normal ml-0.5" style={{ color:theme.textDim }}>{unit}</span>
        </p>
      </div>
    </motion.div>
  );
}

export default function WallCalendar() {
  const today = new Date(); today.setHours(0, 0, 0, 0);


  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [dir,   setDir]   = useState<1|-1>(1);
  const [aKey,  setAKey]  = useState(0);

  const [selStart, setSelStart] = useState<Date|null>(null);
  const [selEnd,   setSelEnd]   = useState<Date|null>(null);
  const [hovered,  setHovered]  = useState<Date|null>(null);
  const [tooltip,  setTooltip]  = useState<string|null>(null);

  const [themeKey, setThemeKey] = useState<ThemeKey>('aurora');
  const theme = THEMES[themeKey];

  const [vacations,   setVacations]   = useState<Vacation[]>([]);
  const [showModal,   setShowModal]   = useState(false);
  const [editingVac,  setEditingVac]  = useState<Vacation|null>(null);

  const [rightTab,  setRightTab]  = useState<RightTab>('vacation');
  const [noteText,  setNoteText]  = useState('');
  const [notes,     setNotes]     = useState<Note[]>([]);
  const [noteSaved, setNoteSaved] = useState(false);

  const { particles, fire } = useParticles();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(VAC_STORE);
      if (raw) setVacations(JSON.parse(raw));
    } catch {}
  }, []);

  const persistVacations = (updated: Vacation[]) => {
    setVacations(updated);
    localStorage.setItem(VAC_STORE, JSON.stringify(updated));
  };
  useEffect(() => {
    if (!selStart) { setNotes([]); return; }
    try {
      const k   = noteKey(toISO(selStart), selEnd ? toISO(selEnd) : toISO(selStart));
      const raw = localStorage.getItem(k);
      setNotes(raw ? JSON.parse(raw) : []);
    } catch { setNotes([]); }
  }, [selStart, selEnd]);

  const firstDay  = new Date(year, month, 1).getDay();
  const daysCount = new Date(year, month + 1, 0).getDate();
  const cells: (Date|null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysCount }, (_, i) => {
      const d = new Date(year, month, i + 1); d.setHours(0, 0, 0, 0); return d;
    }),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  // ── Navigation helpers ───────────────────────────────────────────────────────
  const navigate = (d: 1|-1) => {
    setDir(d); setAKey(k => k + 1);
    if (d === 1) { month===11 ? (setMonth(0), setYear(y=>y+1)) : setMonth(m=>m+1); }
    else         { month===0  ? (setMonth(11),setYear(y=>y-1)) : setMonth(m=>m-1); }
  };

  const jumpTo = (m: number, y: number) => {
    setDir(y > year || (y===year && m > month) ? 1 : -1);
    setAKey(k => k + 1);
    setMonth(m); setYear(y);
  };

  const goToday = () => jumpTo(today.getMonth(), today.getFullYear());

  // ── Day click ────────────────────────────────────────────────────────────────
  const handleDayClick = (date: Date, e: React.MouseEvent) => {
    fire(e.clientX, e.clientY);
    if (!selStart || (selStart && selEnd)) { setSelStart(date); setSelEnd(null); }
    else {
      if (sameDay(date, selStart)) { setSelStart(null); return; }
      date < selStart ? (setSelEnd(selStart), setSelStart(date)) : setSelEnd(date);
    }
    setRightTab('vacation');
  };

  // ── Day visual state ─────────────────────────────────────────────────────────
  const ds = (d: Date) => ({
    isStart:  !!(selStart && sameDay(d, selStart)),
    isEnd:    !!(selEnd   && sameDay(d, selEnd)),
    inRange:  !!(selStart && selEnd   && isBetween(d, selStart, selEnd)),
    inHover:  !!(selStart && !selEnd  && hovered && isBetween(d, selStart, hovered)),
    isToday:  sameDay(d, today),
    vacs:     vacsOnDate(vacations, d),
  });

  // ── Vacation CRUD ────────────────────────────────────────────────────────────
  const openNew = () => { setEditingVac(null); setShowModal(true); };
  const openEdit = (v: Vacation) => { setEditingVac(v); setShowModal(true); };

  const handleSave = (data: Omit<Vacation,'id'|'createdAt'>) => {
    if (editingVac) {
      persistVacations(vacations.map(v => v.id===editingVac.id ? {...v,...data} : v));
    } else {
      const v: Vacation = { id:Date.now().toString(), createdAt:new Date().toISOString(), ...data };
      persistVacations([...vacations, v]);
    }
    setShowModal(false); setEditingVac(null);
  };

  const deleteVac = (id: string) => persistVacations(vacations.filter(v => v.id!==id));

  const jumpToVac = (v: Vacation) => {
    const d = fromISO(v.start);
    jumpTo(d.getMonth(), d.getFullYear());
  };

  // ── Notes CRUD ───────────────────────────────────────────────────────────────
  const saveNote = () => {
    if (!selStart || !noteText.trim()) return;
    const k = noteKey(toISO(selStart), selEnd ? toISO(selEnd) : toISO(selStart));
    const n: Note = { id:Date.now().toString(), text:noteText.trim(), createdAt:new Date().toISOString() };
    const updated = [...notes, n];
    localStorage.setItem(k, JSON.stringify(updated));
    setNotes(updated); setNoteText('');
    setNoteSaved(true); setTimeout(()=>setNoteSaved(false), 2000);
  };

  const deleteNote = (id: string) => {
    if (!selStart) return;
    const k = noteKey(toISO(selStart), selEnd ? toISO(selEnd) : toISO(selStart));
    const updated = notes.filter(n => n.id!==id);
    localStorage.setItem(k, JSON.stringify(updated)); setNotes(updated);
  };

  // ── Derived values ───────────────────────────────────────────────────────────
  const selectedDays  = selStart && selEnd ? daysBetween(selStart,selEnd)+1 : selStart ? 1 : 0;
  const totalVacDays  = vacations.reduce((acc,v)=>acc+daysBetween(fromISO(v.start),fromISO(v.end))+1, 0);
  const upcomingVac   = [...vacations]
    .filter(v => fromISO(v.end) >= today)
    .sort((a,b) => a.start.localeCompare(b.start))[0];
  const daysToNext    = upcomingVac ? daysBetween(today, fromISO(upcomingVac.start)) : null;

  const notesLabel = selStart
    ? selEnd
      ? `${fmtShort(toISO(selStart))} – ${fmtShort(toISO(selEnd))}`
      : fmtLong(toISO(selStart))
    : null;

  const slideVariants = {
    enter:  (d: number) => ({ x:d>0?'55%':'-55%', opacity:0, scale:0.93 }),
    center: { x:0, opacity:1, scale:1 },
    exit:   (d: number) => ({ x:d>0?'-55%':'55%', opacity:0, scale:0.93 }),
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <>
      <AuroraBackground theme={theme} />

      {/* Particles */}
      {particles.map((p, i) => (
        <motion.div key={p.id} className="fixed pointer-events-none rounded-full"
          style={{ left:p.x, top:p.y, width:8, height:8, background:theme.primary, zIndex:9999,
                   boxShadow:`0 0 8px ${theme.primary}` }}
          initial={{ scale:1, opacity:1, x:0, y:0 }}
          animate={{ scale:0, opacity:0, x:Math.cos(p.angle)*58, y:Math.sin(p.angle)*58 }}
          transition={{ duration:0.7, ease:'easeOut' }}
        />
      ))}

      {/* Vacation modal */}
      <AnimatePresence>
        {showModal && (
          <VacationModal
            theme={theme}
            editing={editingVac}
            initialStart={selStart ? toISO(selStart) : ''}
            initialEnd={selEnd ? toISO(selEnd) : selStart ? toISO(selStart) : ''}
            onClose={() => { setShowModal(false); setEditingVac(null); }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      {/* ── PAGE ── */}
      <div className="relative min-h-screen flex flex-col items-center py-6 px-3 sm:px-5" style={{ zIndex:1 }}>

        {/* ── TOP BAR ── */}
        <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
          className="w-full max-w-7xl flex items-center justify-between mb-5 px-1">
          <div className="flex items-center gap-3">
            <motion.div animate={{ rotate:[0,-8,8,-4,0] }} transition={{ duration:3, repeat:Infinity, delay:2 }}
              className="text-3xl select-none">🗓️</motion.div>
            <div>
              <h1 className="text-base font-bold" style={{ fontFamily:"'Playfair Display',serif", color:theme.textBright }}>
                Vacation Planner
              </h1>
              <p className="text-xs" style={{ color:theme.textDim }}>Plan · Dream · Track</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme switcher */}
            <div className="hidden sm:flex items-center gap-1.5">
              {(Object.keys(THEMES) as ThemeKey[]).map(k => (
                <motion.button key={k} whileHover={{ scale:1.18 }} whileTap={{ scale:0.88 }}
                  onClick={() => setThemeKey(k)} title={THEMES[k].name}
                  className="w-8 h-8 rounded-full flex items-center justify-center relative"
                  style={{
                    background: themeKey===k ? THEMES[k].btnGrad : 'rgba(255,255,255,0.07)',
                    boxShadow:  themeKey===k ? THEMES[k].btnShadow : 'none',
                    border: `1px solid ${themeKey===k ? THEMES[k].primary : 'rgba(255,255,255,0.1)'}`,
                  }}>
                  <span style={{ fontSize:'0.85rem' }}>{THEMES[k].emoji}</span>
                </motion.button>
              ))}
            </div>
            <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
              onClick={goToday}
              className="px-4 py-2 rounded-full text-xs font-bold text-white"
              style={{ background:theme.btnGrad, boxShadow:theme.btnShadow }}>
              ⏱ Today
            </motion.button>
          </div>
        </motion.div>

        {/* ── STATS STRIP ── */}
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }}
          className="w-full max-w-7xl grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <StatCard icon="✈️" label="Trips Planned"  value={vacations.length} unit=" trips"   theme={theme} />
          <StatCard icon="🌍" label="Days Planned"   value={totalVacDays}     unit=" days"    theme={theme} />
          <StatCard icon="🎯" label="Selected"       value={selectedDays}     unit={selectedDays===1?' day':' days'} theme={theme} />
          <StatCard
            icon="⏰" label="Next Trip In"
            value={daysToNext !== null ? daysToNext===0?'Today':daysToNext : '–'}
            unit={daysToNext !== null && daysToNext>0 ? ' days' : ''}
            theme={theme}
          />
        </motion.div>

        {/* ── MAIN CARD ── */}
        <motion.div initial={{ opacity:0, y:24, scale:0.98 }} animate={{ opacity:1, y:0, scale:1 }}
          transition={{ delay:0.12, duration:0.55, ease:[0.22,1,0.36,1] }}
          className="w-full max-w-7xl rounded-3xl overflow-hidden flex flex-col xl:flex-row"
          style={{
            background: theme.glassBg,
            border: `1px solid ${theme.glassBorder}`,
            backdropFilter:'blur(40px)', WebkitBackdropFilter:'blur(40px)',
            boxShadow:`0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px ${theme.glassBorder}, inset 0 1px 0 rgba(255,255,255,0.07)`,
          }}>

          {/* ════════ LEFT SIDEBAR: My Trips ════════ */}
          <div className="xl:w-72 shrink-0 flex flex-col order-3 xl:order-1"
            style={{ borderTop:`1px solid ${theme.glassBorder}` }}>

            {/* Sidebar header */}
            <div className="p-5 border-b" style={{ borderColor:theme.glassBorder }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🗺️</span>
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:700, color:theme.textBright }}>
                    My Trips
                  </h2>
                  {vacations.length > 0 && (
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background:theme.btnGrad, color:'#fff', fontSize:'0.6rem' }}>
                      {vacations.length}
                    </span>
                  )}
                </div>
                <motion.button whileHover={{ scale:1.1, rotate:90 }} whileTap={{ scale:0.9 }}
                  onClick={openNew}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ background:theme.btnGrad, boxShadow:theme.btnShadow }}>
                  +
                </motion.button>
              </div>

              {/* Upcoming trip highlight */}
              {upcomingVac && (
                <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                  className="p-3 rounded-2xl cursor-pointer" onClick={() => jumpToVac(upcomingVac)}
                  style={{ background:VAC_TYPES[upcomingVac.type].bg, border:`1px solid ${VAC_TYPES[upcomingVac.type].color}45` }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color:VAC_TYPES[upcomingVac.type].color }}>
                    ⏰ Next Trip
                  </p>
                  <p className="text-sm font-bold" style={{ color:theme.textBright }}>
                    {VAC_TYPES[upcomingVac.type].emoji} {upcomingVac.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color:theme.textMid }}>
                    {fmtShort(upcomingVac.start)} → {fmtShort(upcomingVac.end)}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Trip list */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2" style={{ maxHeight:380 }}>
              <AnimatePresence mode="popLayout">
                {vacations.length === 0 ? (
                  <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }}
                    className="flex flex-col items-center py-10 gap-3 text-center">
                    <motion.span animate={{ y:[0,-8,0], rotate:[-5,5,-3,3,0] }}
                      transition={{ duration:3.5, repeat:Infinity }} className="text-5xl select-none">
                      🌴
                    </motion.span>
                    <p className="text-sm font-semibold" style={{ color:'rgba(255,255,255,0.28)' }}>
                      No trips yet
                    </p>
                    <p className="text-xs leading-relaxed max-w-36" style={{ color:'rgba(255,255,255,0.16)' }}>
                      Select dates on the calendar then click + to plan your first trip
                    </p>
                  </motion.div>
                ) : (
                  [...vacations]
                    .sort((a,b) => a.start.localeCompare(b.start))
                    .map((v, i) => {
                      const vt     = VAC_TYPES[v.type];
                      const isPast = fromISO(v.end) < today;
                      return (
                        <motion.div key={v.id} layout
                          initial={{ opacity:0, y:14, scale:0.95 }}
                          animate={{ opacity:isPast?0.48:1, y:0, scale:1 }}
                          exit={{ opacity:0, x:-50, scale:0.9 }}
                          transition={{ delay:i*0.035, type:'spring', stiffness:260, damping:26 }}
                          className="group relative p-3 rounded-2xl cursor-pointer"
                          style={{ background:vt.bg, border:`1px solid ${vt.color}38` }}
                          onClick={() => jumpToVac(v)}>

                          {/* Left accent bar */}
                          <div className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full"
                            style={{ background:vt.grad }} />

                          <div className="flex items-start gap-2 pl-1">
                            <span className="text-xl shrink-0 mt-0.5">{vt.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold truncate" style={{ color:theme.textBright }}>
                                {v.name}
                              </p>
                              <p className="text-xs mt-0.5 font-medium" style={{ color:vt.color }}>
                                {fmtShort(v.start)} → {fmtShort(v.end)}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                                  style={{ background:`${vt.color}22`, color:vt.color, fontSize:'0.6rem' }}>
                                  {vt.label}
                                </span>
                                <span className="text-xs" style={{ color:theme.textDim }}>
                                  {daysBetween(fromISO(v.start),fromISO(v.end))+1}d
                                  {isPast ? ' · Past' : ''}
                                </span>
                              </div>
                            </div>
                            {/* Edit/Delete */}
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <motion.button whileHover={{ scale:1.15 }} whileTap={{ scale:0.88 }}
                                onClick={e => { e.stopPropagation(); openEdit(v); }}
                                className="w-6 h-6 rounded-full flex items-center justify-center"
                                style={{ background:'rgba(255,255,255,0.12)', fontSize:'0.7rem' }}>
                                ✏️
                              </motion.button>
                              <motion.button whileHover={{ scale:1.15 }} whileTap={{ scale:0.88 }}
                                onClick={e => { e.stopPropagation(); deleteVac(v.id); }}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{ background:'rgba(239,68,68,0.15)', color:'#f87171' }}>
                                ✕
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ════════ CENTER: Calendar ════════ */}
          <div className="flex-1 flex flex-col order-1 xl:order-2"
            style={{
              borderLeft: `1px solid ${theme.glassBorder}`,
              borderRight: `1px solid ${theme.glassBorder}`,
            }}>

            {/* Hero image */}
            <div className="relative overflow-hidden shrink-0" style={{ height:'clamp(155px,22vw,252px)' }}>
              <AnimatePresence mode="wait" custom={dir}>
                <motion.img key={`${year}-${month}`} src={MONTH_IMAGES[month]} alt={MONTHS[month]}
                  className="absolute inset-0 w-full h-full object-cover"
                  custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit"
                  transition={{ duration:0.55, ease:[0.32,0.72,0,1] }}
                />
              </AnimatePresence>
              <div className="absolute inset-0" style={{ background:'linear-gradient(to bottom,rgba(0,0,0,0.08) 0%,rgba(0,0,0,0.75) 100%)' }} />
              <div className="absolute inset-0" style={{ background:`linear-gradient(135deg,${theme.blob1}48 0%,transparent 55%)` }} />

              {/* Month label + nav */}
              <div className="absolute inset-x-0 bottom-0 px-5 py-4 flex items-end justify-between">
                <AnimatePresence mode="wait">
                  <motion.div key={`hdr-${year}-${month}`}
                    initial={{ opacity:0, y:22, filter:'blur(8px)' }}
                    animate={{ opacity:1, y:0, filter:'blur(0px)' }}
                    exit={{ opacity:0, y:-14, filter:'blur(5px)' }}
                    transition={{ duration:0.42 }}>
                    <div className="flex items-baseline gap-3">
                      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.75rem,4vw,2.75rem)', fontWeight:700, color:'#fff', lineHeight:1, textShadow:'0 2px 20px rgba(0,0,0,0.65)' }}>
                        {MONTHS[month]}
                      </h1>
                      <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1rem,2vw,1.35rem)', color:'rgba(255,255,255,0.52)' }}>
                        {year}
                      </span>
                    </div>
                    {selectedDays > 0 && (
                      <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                        style={{ background:'rgba(255,255,255,0.16)', backdropFilter:'blur(10px)', color:'#fff', border:'1px solid rgba(255,255,255,0.24)' }}>
                        <span className="w-1.5 h-1.5 rounded-full"
                          style={{ background:theme.primary, boxShadow:`0 0 6px ${theme.primary}`, display:'inline-block' }} />
                        {selectedDays} day{selectedDays>1?'s':''} selected
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
                <div className="flex gap-2 shrink-0">
                  {([-1, 1] as const).map(d => (
                    <motion.button key={d} whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                      onClick={() => navigate(d)}
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-xl font-light"
                      style={{ background:'rgba(255,255,255,0.16)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.22)' }}>
                      {d===-1 ? '‹' : '›'}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Month quick-jump */}
            <div className="px-4 pt-3 pb-1 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex gap-1 flex-wrap">
                {MONTHS_SHORT.map((m, i) => (
                  <motion.button key={m+i} whileHover={{ scale:1.08 }} whileTap={{ scale:0.92 }}
                    onClick={() => jumpTo(i, year)}
                    className="px-2 py-1 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: i===month ? theme.btnGrad : 'rgba(255,255,255,0.04)',
                      color: i===month ? '#fff' : theme.textDim,
                      boxShadow: i===month ? theme.btnShadow : 'none',
                      border: `1px solid ${i===month ? theme.primary+'60' : 'transparent'}`,
                    }}>
                    {m}
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-1 shrink-0">
                {[year-1, year, year+1].map(y => (
                  <button key={y} onClick={() => jumpTo(month, y)}
                    className="px-2 py-1 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: y===year ? 'rgba(255,255,255,0.1)' : 'transparent',
                      color: y===year ? theme.textBright : theme.textDim,
                    }}>
                    {y}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar grid */}
            <div className="flex-1 px-3 sm:px-5 pb-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS_FULL.map((d, i) => (
                  <div key={d+i} className="text-center py-2 text-xs font-bold uppercase tracking-wider"
                    style={{ color:theme.textDim }}>
                    <span className="hidden sm:inline">{d}</span>
                    <span className="sm:hidden">{DAYS_SHORT[i]}</span>
                  </div>
                ))}
              </div>
              <div className="mb-2 h-px rounded-full"
                style={{ background:`linear-gradient(90deg,transparent,${theme.primary}55,transparent)` }} />

              {/* Cells */}
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div key={aKey} custom={dir} variants={slideVariants}
                  initial="enter" animate="center" exit="exit"
                  transition={{ duration:0.38, ease:[0.32,0.72,0,1] }}
                  className="grid grid-cols-7">
                  {cells.map((date, idx) => {
                    if (!date) return <div key={`e${idx}`} className="aspect-square" />;

                    const { isStart, isEnd, inRange, inHover, isToday, vacs } = ds(date);
                    const highlighted = inRange || inHover;
                    const holiday     = HOLIDAYS[hKey(date)];
                    const isWeekend   = date.getDay()===0 || date.getDay()===6;
                    const isEdge      = isStart || isEnd;
                    const topVac      = vacs[0] ?? null;
                    const dateISO     = toISO(date);

                    return (
                      <div key={dateISO}
                        className="relative flex items-center justify-center aspect-square group"
                        onMouseEnter={() => { setHovered(date); if (holiday||topVac) setTooltip(dateISO); }}
                        onMouseLeave={() => { setHovered(null); setTooltip(null); }}>

                        {/* Range background strip */}
                        {highlighted && (
                          <div className="absolute inset-y-1 left-0 right-0"
                            style={{ background:theme.rangeColor }} />
                        )}
                        {isStart && selEnd && (
                          <div className="absolute inset-y-1 right-0 left-1/2"
                            style={{ background:theme.rangeColor }} />
                        )}
                        {isEnd && selStart && !sameDay(selStart, date) && (
                          <div className="absolute inset-y-1 left-0 right-1/2"
                            style={{ background:theme.rangeColor }} />
                        )}

                        {/* Vacation color band */}
                        {topVac && (
                          <div className="absolute bottom-0.5 left-0.5 right-0.5 rounded-full"
                            style={{ height:3, background:VAC_TYPES[topVac.type].grad, opacity:isEdge?0.5:0.75 }} />
                        )}

                        {/* Day button */}
                        <motion.button
                          whileHover={!isEdge ? { scale:1.2 } : {}}
                          whileTap={{ scale:0.83 }}
                          onClick={e => handleDayClick(date, e)}
                          className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex flex-col items-center justify-center text-sm font-semibold select-none"
                          style={{
                            background: isStart ? theme.startGrad : isEnd ? theme.endGrad : 'transparent',
                            boxShadow: isStart
                              ? `0 4px 20px rgba(${theme.primaryRgb},0.65)`
                              : isEnd
                              ? '0 4px 20px rgba(239,68,68,0.55)'
                              : isToday
                              ? `0 0 0 2px ${theme.primary}, 0 0 14px ${theme.primary}45`
                              : 'none',
                            color: isEdge      ? '#fff'
                                 : highlighted ? theme.secondary
                                 : isToday     ? theme.primary
                                 : isWeekend   ? theme.textDim
                                 : theme.textBright,
                            fontWeight: isToday || isEdge ? 800 : 500,
                          }}>
                          <span className="leading-none">{date.getDate()}</span>

                          {/* Vacation indicator dot (on edge cells) */}
                          {topVac && isEdge && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                              style={{ background:VAC_TYPES[topVac.type].color, borderColor:'rgba(0,0,0,0.5)' }} />
                          )}

                          {/* Holiday dot */}
                          {holiday && !topVac && (
                            <span className="absolute bottom-0.5 w-1 h-1 rounded-full"
                              style={{ background:isEdge?'#fff':theme.primary, boxShadow:`0 0 4px ${theme.primary}` }} />
                          )}
                        </motion.button>

                        {/* Hover ring */}
                        {!isEdge && (
                          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                            style={{ boxShadow:`inset 0 0 0 1.5px ${theme.primary}45` }} />
                        )}

                        {/* Tooltip */}
                        <AnimatePresence>
                          {tooltip===dateISO && (holiday||topVac) && (
                            <motion.div
                              initial={{ opacity:0, y:5, scale:0.88 }}
                              animate={{ opacity:1, y:0, scale:1 }}
                              exit={{ opacity:0, y:5, scale:0.88 }}
                              transition={{ duration:0.15 }}
                              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap pointer-events-none shadow-2xl"
                              style={{
                                background: topVac ? VAC_TYPES[topVac.type].grad : theme.btnGrad,
                                color: '#fff',
                                boxShadow: theme.btnShadow,
                              }}>
                              {topVac
                                ? `${VAC_TYPES[topVac.type].emoji} ${topVac.name}`
                                : `${holiday!.emoji} ${holiday!.label}`}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Legend */}
            <div className="px-5 pb-4 flex flex-wrap gap-x-4 gap-y-2 border-t pt-3" style={{ borderColor:theme.glassBorder }}>
              {[
                { color:'linear-gradient(135deg,#4f46e5,#7c3aed)', label:'Start date', shadow:'none' },
                { color:'linear-gradient(135deg,#dc2626,#f43f5e)', label:'End date',   shadow:'none' },
                { color:theme.primary,                             label:'Today',      shadow:`0 0 6px ${theme.primary}80` },
                { color:theme.rangeColor,                          label:'Range',      shadow:'none', border:`1px solid ${theme.primary}40` },
                { color:'linear-gradient(90deg,#22d3ee,#f472b6,#fbbf24)', label:'Vacation', shadow:'none' },
              ].map(({ color, label, shadow, border }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="shrink-0 rounded-full"
                    style={{ width:label==='Vacation'?20:12, height:label==='Vacation'?4:12,
                             background:color, boxShadow:shadow, border:border||'none' }} />
                  <span className="text-xs font-medium" style={{ color:theme.textDim }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ════════ RIGHT PANEL: Plan / Notes ════════ */}
          <div className="xl:w-80 shrink-0 flex flex-col order-2 xl:order-3">

            {/* Tabs */}
            <div className="flex border-b shrink-0" style={{ borderColor:theme.glassBorder }}>
              {(['vacation','notes'] as RightTab[]).map(tab => (
                <button key={tab} onClick={() => setRightTab(tab)}
                  className="flex-1 py-4 text-xs font-bold uppercase tracking-widest relative transition-colors"
                  style={{ color:rightTab===tab ? theme.primary : theme.textDim }}>
                  {tab==='vacation' ? '🏝️ Plan Trip' : '📝 Notes'}
                  {rightTab===tab && (
                    <motion.div layoutId="right-tab-bar"
                      className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full"
                      style={{ background:theme.btnGrad }} />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">

              {/* ── Vacation tab ── */}
              {rightTab==='vacation' && (
                <motion.div key="vac-tab"
                  initial={{ opacity:0, x:18 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-18 }}
                  className="flex-1 flex flex-col overflow-y-auto">

                  {/* Selection info */}
                  <div className="p-5 border-b" style={{ borderColor:theme.glassBorder }}>
                    {selStart ? (
                      <div className="p-3 rounded-2xl mb-3"
                        style={{ background:`rgba(${theme.primaryRgb},0.1)`, border:`1px solid rgba(${theme.primaryRgb},0.22)` }}>
                        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color:theme.textDim }}>
                          Selected
                        </p>
                        <p className="text-sm font-bold" style={{ color:theme.textBright }}>
                          {fmtShort(toISO(selStart))}{selEnd ? ` → ${fmtShort(toISO(selEnd))}` : ''}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color:theme.textMid }}>
                          {selectedDays} day{selectedDays>1?'s':''}
                          {selStart && selEnd
                            ? ` · ${(() => {
                                const s=selStart, e=selEnd;
                                const y1=s.getFullYear(),y2=e.getFullYear();
                                return y1===y2
                                  ? `${MONTHS_SHORT[s.getMonth()]} – ${MONTHS_SHORT[e.getMonth()]} ${y1}`
                                  : `${y1} – ${y2}`;
                              })()}`
                            : ''}
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl mb-3 text-center"
                        style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                        <p className="text-xs leading-relaxed" style={{ color:'rgba(255,255,255,0.28)' }}>
                          👆 Click a start date, then an end date on the calendar
                        </p>
                      </div>
                    )}

                    <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                      onClick={openNew}
                      className="w-full py-3.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2"
                      style={{ background:theme.btnGrad, boxShadow:theme.btnShadow }}>
                      ✈️ <span>Plan New Trip</span>
                    </motion.button>
                  </div>

                  {/* Type summary */}
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color:theme.textDim }}>
                      Trip Types
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.entries(VAC_TYPES) as [VacType, typeof VAC_TYPES[VacType]][]).map(([k, v]) => {
                        const count = vacations.filter(vac => vac.type===k).length;
                        return (
                          <motion.div key={k} whileHover={{ scale:1.03, y:-1 }}
                            className="flex items-center gap-2 p-2.5 rounded-xl"
                            style={{
                              background: count>0 ? v.bg : 'rgba(255,255,255,0.03)',
                              border: `1px solid ${count>0 ? v.color+'45' : 'rgba(255,255,255,0.06)'}`,
                            }}>
                            <span className="text-lg">{v.emoji}</span>
                            <div>
                              <p className="text-xs font-bold" style={{ color:count>0?v.color:theme.textDim }}>
                                {v.label}
                              </p>
                              <p className="text-xs" style={{ color:theme.textDim }}>
                                {count} trip{count!==1?'s':''}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Notes tab ── */}
              {rightTab==='notes' && (
                <motion.div key="notes-tab"
                  initial={{ opacity:0, x:18 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-18 }}
                  className="flex-1 flex flex-col overflow-hidden">

                  {/* Active range badge */}
                  <div className="p-4 border-b shrink-0" style={{ borderColor:theme.glassBorder }}>
                    {notesLabel ? (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-2xl"
                        style={{ background:`rgba(${theme.primaryRgb},0.1)`, border:`1px solid rgba(${theme.primaryRgb},0.22)` }}>
                        <motion.span animate={{ scale:[1,1.35,1] }} transition={{ duration:1.6, repeat:Infinity }}
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background:theme.primary, boxShadow:`0 0 6px ${theme.primary}` }} />
                        <span className="text-xs font-semibold truncate" style={{ color:theme.primary }}>
                          {notesLabel}
                        </span>
                        {notes.length>0 && (
                          <span className="ml-auto shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background:theme.btnGrad, color:'#fff', fontSize:'0.6rem', fontWeight:700 }}>
                            {notes.length}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-center py-1" style={{ color:'rgba(255,255,255,0.25)' }}>
                        Select a date to write notes
                      </p>
                    )}
                  </div>

                  {/* Textarea + save */}
                  <div className="p-4 border-b shrink-0" style={{ borderColor:theme.glassBorder }}>
                    <div className="relative">
                      <textarea value={noteText} onChange={e=>setNoteText(e.target.value)}
                        onKeyDown={e=>{if(e.key==='Enter'&&(e.metaKey||e.ctrlKey))saveNote();}}
                        disabled={!selStart}
                        placeholder={selStart ? '✍️ Write a note… (⌘+Enter to save)' : 'Select a date first…'}
                        rows={4}
                        className="w-full resize-none rounded-2xl px-4 py-3 text-sm outline-none transition-all disabled:cursor-not-allowed"
                        style={{
                          background:'rgba(255,255,255,0.05)',
                          border:`1.5px solid ${theme.inputBorder}`,
                          color:theme.textBright,
                          fontFamily:"'Inter',sans-serif",
                          caretColor:theme.primary,
                          lineHeight:1.65,
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor=theme.inputFocusBorder; e.currentTarget.style.boxShadow=theme.inputFocusShadow; }}
                        onBlur={e  => { e.currentTarget.style.borderColor=theme.inputBorder; e.currentTarget.style.boxShadow='none'; }}
                      />
                      {noteText.length>0 && (
                        <span className="absolute bottom-2.5 right-3 text-xs" style={{ color:theme.textDim }}>
                          {noteText.length}
                        </span>
                      )}
                    </div>
                    <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                      onClick={saveNote} disabled={!selStart||!noteText.trim()}
                      className="mt-2.5 w-full py-3 rounded-2xl text-sm font-bold text-white disabled:opacity-25 disabled:cursor-not-allowed overflow-hidden"
                      style={{ background:theme.btnGrad, boxShadow:selStart&&noteText.trim()?theme.btnShadow:'none' }}>
                      <AnimatePresence mode="wait">
                        {noteSaved
                          ? <motion.span key="ok" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="flex items-center justify-center gap-1.5">✓ Saved!</motion.span>
                          : <motion.span key="sv" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} className="flex items-center justify-center gap-1.5">Save Note <span className="opacity-55 text-xs">⌘↵</span></motion.span>
                        }
                      </AnimatePresence>
                    </motion.button>
                  </div>

                  {/* Notes list */}
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
                    <AnimatePresence mode="popLayout">
                      {notes.length===0 ? (
                        <motion.div key="no-notes" initial={{opacity:0}} animate={{opacity:1}}
                          className="flex flex-col items-center py-10 gap-3">
                          <motion.span animate={{y:[0,-7,0]}} transition={{duration:3,repeat:Infinity}} className="text-4xl select-none">📋</motion.span>
                          <p className="text-xs text-center" style={{color:'rgba(255,255,255,0.25)'}}>
                            {selStart ? 'No notes for this period' : 'Select a date to start'}
                          </p>
                        </motion.div>
                      ) : notes.map((note, i) => (
                        <motion.div key={note.id} layout
                          initial={{opacity:0,y:14,scale:0.95}} animate={{opacity:1,y:0,scale:1}}
                          exit={{opacity:0,x:50,scale:0.9}} transition={{delay:i*0.04,type:'spring',stiffness:260,damping:26}}
                          className="group relative rounded-2xl p-3.5"
                          style={{ background:theme.noteCard, border:`1px solid rgba(${theme.primaryRgb},0.18)`, boxShadow:'0 4px 16px rgba(0,0,0,0.22)' }}>
                          <div className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full" style={{ background:theme.btnGrad }} />
                          <p className="pl-3 text-sm leading-relaxed" style={{ color:theme.textBright }}>{note.text}</p>
                          <p className="pl-3 text-xs mt-1.5 font-medium" style={{ color:theme.textDim }}>
                            {new Date(note.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}
                          </p>
                          <motion.button whileHover={{scale:1.12}} whileTap={{scale:0.88}}
                            onClick={()=>deleteNote(note.id)}
                            className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{background:'rgba(239,68,68,0.15)',color:'#f87171'}}>✕</motion.button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {notes.length>0 && (
                    <div className="px-4 py-3 border-t flex items-center justify-between shrink-0" style={{ borderColor:theme.glassBorder }}>
                      <span className="text-xs" style={{ color:theme.textDim }}>{notes.length} note{notes.length>1?'s':''}</span>
                      <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                        onClick={()=>{
                          if(!selStart)return;
                          const k=noteKey(toISO(selStart),selEnd?toISO(selEnd):toISO(selStart));
                          localStorage.removeItem(k); setNotes([]);
                        }}
                        className="text-xs px-3 py-1 rounded-full"
                        style={{color:'rgba(239,68,68,0.65)',border:'1px solid rgba(239,68,68,0.22)'}}>
                        Clear all
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer hint */}
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2}}
          className="mt-5 text-center text-xs" style={{ color:'rgba(255,255,255,0.18)' }}>
          Click a date to select · Click again for range · Add trips with ✈️ · Hover dates to see events
        </motion.p>
      </div>
    </>
  );
}
