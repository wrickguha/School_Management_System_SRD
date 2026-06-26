import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ChevronLeft, ChevronRight, Bell, BellOff, Calendar, Info } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../store/AuthContext';

// ── Types ──────────────────────────────────────────────────────────────────────
type EventType = 'Holiday' | 'Exam' | 'Sport' | 'Cultural' | 'Meeting' | 'Other';

interface SchoolEvent {
  id: number;
  title: string;
  description: string;
  date: string;        // YYYY-MM-DD
  start_time?: string; // HH:MM
  end_time?: string;
  type: EventType;
  notify_all: boolean;
  created_by?: string;
}

interface EventForm {
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  type: EventType;
  notify_all: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const EVENT_TYPE_COLORS: Record<EventType, { bg: string; text: string; badge: string }> = {
  Holiday:  { bg: 'bg-red-100 dark:bg-red-950/40',     text: 'text-red-700 dark:text-red-300',     badge: 'bg-red-500' },
  Exam:     { bg: 'bg-blue-100 dark:bg-blue-950/40',   text: 'text-blue-700 dark:text-blue-300',   badge: 'bg-blue-500' },
  Sport:    { bg: 'bg-green-100 dark:bg-green-950/40', text: 'text-green-700 dark:text-green-300', badge: 'bg-green-500' },
  Cultural: { bg: 'bg-purple-100 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300', badge: 'bg-purple-500' },
  Meeting:  { bg: 'bg-amber-100 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', badge: 'bg-amber-500' },
  Other:    { bg: 'bg-slate-100 dark:bg-slate-800',    text: 'text-slate-700 dark:text-slate-300', badge: 'bg-slate-500' },
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// ── Demo data (used as fallback when backend is unavailable) ──────────────────
const DEMO_EVENTS: SchoolEvent[] = [
  { id: 1, title: 'Mid-Term Examinations', description: 'Mid-term exams for all classes Grade 6–12.', date: '2026-07-10', start_time: '09:00', end_time: '12:00', type: 'Exam', notify_all: true, created_by: 'Faculty' },
  { id: 2, title: 'Annual Sports Day', description: 'Inter-house sports competition on the main ground.', date: '2026-07-22', start_time: '08:00', end_time: '17:00', type: 'Sport', notify_all: true, created_by: 'Faculty' },
  { id: 3, title: 'Independence Day Holiday', description: 'National holiday – school closed.', date: '2026-08-15', type: 'Holiday', notify_all: true, created_by: 'Faculty' },
  { id: 4, title: 'Parent-Teacher Meeting', description: 'PTM for Grade 10 & 12 parents.', date: '2026-08-05', start_time: '10:00', end_time: '13:00', type: 'Meeting', notify_all: false, created_by: 'Faculty' },
  { id: 5, title: 'Cultural Festival', description: 'Annual school cultural fest — music, dance, drama.', date: '2026-09-15', start_time: '10:00', end_time: '18:00', type: 'Cultural', notify_all: true, created_by: 'Faculty' },
];

// ── API ───────────────────────────────────────────────────────────────────────
const eventsApi = {
  getAll: async (): Promise<SchoolEvent[]> => {
    try {
      const res = await apiClient.get('/events');
      const result = res.data.data ?? res.data;
      return Array.isArray(result) ? result : DEMO_EVENTS;
    } catch {
      return DEMO_EVENTS;
    }
  },
  create: async (payload: Omit<SchoolEvent, 'id'>) => {
    const res = await apiClient.post('/events', payload);
    return res.data.data ?? res.data;
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function EventCalendarModule() {
  const queryClient = useQueryClient();
  const { role: userRole } = useAuth();
  const canCreate = ['Faculty', 'Teacher', 'Principal', 'School Admin', 'Super Admin'].includes(userRole ?? '');

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState<EventForm>({
    title: '', description: '', date: toYMD(today),
    start_time: '', end_time: '',
    type: 'Other', notify_all: false,
  });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['school-events'],
    queryFn: eventsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: eventsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-events'] });
      setIsModalOpen(false);
      setForm({ title: '', description: '', date: toYMD(today), start_time: '', end_time: '', type: 'Other', notify_all: false });
    },
  });

  // ── Calendar grid ──
  const daysInMonth  = getDaysInMonth(viewYear, viewMonth);
  const firstDayIdx  = getFirstDayOfMonth(viewYear, viewMonth);
  const calendarCells: (number | null)[] = [
    ...Array(firstDayIdx).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full weeks
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  // Map events by date
  const eventsByDate = useMemo(() => {
    const map: Record<string, SchoolEvent[]> = {};
    const safeEvents = Array.isArray(events) ? events : [];
    safeEvents.forEach(ev => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [events]);

  const selectedEvents = selectedDate ? (eventsByDate[selectedDate] ?? []) : [];

  // Events for current month (for side-panel list)
  const monthPrefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
  const safeEvents = Array.isArray(events) ? events : [];
  const monthEvents = safeEvents
    .filter(ev => ev.date.startsWith(monthPrefix))
    .sort((a, b) => a.date.localeCompare(b.date));

  const handlePrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const handleNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(prev => prev === dateStr ? null : dateStr);
  };

  const handleOpenModal = () => {
    setForm(f => ({ ...f, date: selectedDate ?? toYMD(today) }));
    setIsModalOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    createMutation.mutate({ ...form, created_by: userRole ?? undefined });
  };

  const todayStr = toYMD(today);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Event Calendar</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            School events, holidays, exams &amp; activities
          </p>
        </div>
        {canCreate && (
          <Button variant="primary" size="sm" onClick={handleOpenModal} leftIcon={<Plus className="h-4 w-4" />}>
            Add Event
          </Button>
        )}
        {!canCreate && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
            <Info className="h-4 w-4" />
            <span>Only Faculty &amp; Teachers can create events</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Calendar ── */}
        <Card className="lg:col-span-2 p-5 space-y-4">
          {/* Nav */}
          <div className="flex items-center justify-between">
            <button onClick={handlePrevMonth} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-base font-extrabold text-slate-800 dark:text-white">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h2>
            <button onClick={handleNextMonth} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 text-center">
            {DAY_NAMES.map(d => (
              <div key={d} className="py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {calendarCells.map((day, idx) => {
              if (!day) return <div key={idx} className="aspect-square" />;
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = eventsByDate[dateStr] ?? [];
              const isToday    = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              return (
                <button
                  key={idx}
                  onClick={() => handleDayClick(day)}
                  className={`aspect-square flex flex-col items-center justify-start pt-1 rounded-xl text-sm font-bold transition-all relative overflow-hidden
                    ${isToday    ? 'bg-school-blue text-white' : ''}
                    ${isSelected && !isToday ? 'ring-2 ring-school-blue bg-blue-50 dark:bg-blue-950/30 text-school-blue' : ''}
                    ${!isToday && !isSelected ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300' : ''}
                  `}
                >
                  <span className="leading-none">{day}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                      {dayEvents.slice(0, 3).map((ev, i) => (
                        <span key={i} className={`h-1.5 w-1.5 rounded-full ${EVENT_TYPE_COLORS[ev.type].badge}`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            {(Object.keys(EVENT_TYPE_COLORS) as EventType[]).map(type => (
              <div key={type} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${EVENT_TYPE_COLORS[type].badge}`} />
                <span className="text-[11px] text-slate-500">{type}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Side Panel ── */}
        <div className="space-y-4">
          {/* Selected day events */}
          {selectedDate && (
            <Card className="p-4 space-y-3">
              <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-school-blue" />
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
              {selectedEvents.length === 0 ? (
                <p className="text-xs text-slate-400">No events on this date.</p>
              ) : (
                selectedEvents.map(ev => <EventCard key={ev.id} event={ev} />)
              )}
              {canCreate && (
                <button onClick={handleOpenModal} className="text-xs text-school-blue font-bold hover:underline flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Add event on this date
                </button>
              )}
            </Card>
          )}

          {/* Month events list */}
          <Card className="p-4 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200">
              {MONTH_NAMES[viewMonth]} Events ({monthEvents.length})
            </h3>
            {isLoading ? (
              <p className="text-xs text-slate-400">Loading events...</p>
            ) : monthEvents.length === 0 ? (
              <p className="text-xs text-slate-400">No events this month.</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {monthEvents.map(ev => <EventCard key={ev.id} event={ev} compact />)}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ── Create Event Modal ── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Event">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Event Title *</label>
            <input
              required
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Annual Sports Day"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Event Type</label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value as EventType }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold cursor-pointer"
              >
                {(Object.keys(EVENT_TYPE_COLORS) as EventType[]).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date *</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Start Time</label>
              <input
                type="time"
                value={form.start_time}
                onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">End Time</label>
              <input
                type="time"
                value={form.end_time}
                onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of the event..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold resize-none"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => setForm(f => ({ ...f, notify_all: !f.notify_all }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.notify_all ? 'bg-school-blue' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.notify_all ? 'left-6' : 'left-1'}`} />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              {form.notify_all ? <Bell className="h-4 w-4 text-school-blue" /> : <BellOff className="h-4 w-4 text-slate-400" />}
              Notify all students &amp; parents
            </span>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ── EventCard sub-component ────────────────────────────────────────────────────
function EventCard({ event, compact = false }: { event: SchoolEvent; compact?: boolean }) {
  const colors = EVENT_TYPE_COLORS[event.type];
  const dateLabel = new Date(event.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  return (
    <div className={`rounded-xl p-3 ${colors.bg} space-y-1`}>
      <div className="flex items-start justify-between gap-2">
        <p className={`text-sm font-bold leading-snug ${colors.text}`}>{event.title}</p>
        <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${colors.badge}`}>{event.type}</span>
      </div>
      {!compact && event.description && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{event.description}</p>
      )}
      <div className="flex items-center gap-3 text-[10px] text-slate-500">
        <span>{dateLabel}</span>
        {event.start_time && <span>{event.start_time}{event.end_time ? ` – ${event.end_time}` : ''}</span>}
        {event.notify_all && <Bell className="h-3 w-3 text-amber-500" />}
      </div>
    </div>
  );
}
