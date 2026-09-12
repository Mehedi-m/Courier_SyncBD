'use client';

import { useState, useMemo } from 'react';
import { 
  Plus, ChevronLeft, ChevronRight, X, Clock, MapPin, 
  Trash2, Calendar as CalendarIcon, Truck, DollarSign, Tag, CheckCircle2 
} from 'lucide-react';

const initialEvents = [
  { id: '1', dateStr: '2026-03-02', title: 'Steadfast Mirpur Bulk Pickup', time: '10:30 AM', type: 'dispatch', color: 'bg-indigo-600 text-white' },
  { id: '2', dateStr: '2026-03-05', title: 'Pathao Rider Express Batch', time: '02:00 PM', type: 'dispatch', color: 'bg-amber-500 text-white' },
  { id: '3', dateStr: '2026-03-12', title: 'Weekly COD Settlement Reconciliation', time: '11:00 AM', type: 'finance', color: 'bg-emerald-600 text-white' },
  { id: '4', dateStr: '2026-03-16', title: 'Victory Flash Sale Dispatch Surge', time: '09:00 AM', type: 'sale', color: 'bg-rose-500 text-white' },
  { id: '5', dateStr: '2026-03-22', title: 'Supplier Restock Delivery Arrival', time: '03:30 PM', type: 'inventory', color: 'bg-sky-500 text-white' },
  { id: '6', dateStr: '2026-03-28', title: 'Monthly Courier Account Audit', time: '04:00 PM', type: 'finance', color: 'bg-emerald-600 text-white' },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026 default
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 2, 12));
  const [viewMode, setViewMode] = useState('Month'); // 'Month' | 'Week' | 'Day'
  const [events, setEvents] = useState(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('10:00 AM');
  const [eventType, setEventType] = useState('dispatch');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  // Generate calendar days for current month
  const calendarGrid = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, d);
      const dateStr = prevDate.toISOString().split('T')[0];
      days.push({ dayNumber: d, date: prevDate, dateStr, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const currDate = new Date(year, month, i);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isSelected = selectedDate && selectedDate.toDateString() === currDate.toDateString();
      const isToday = new Date().toDateString() === currDate.toDateString();
      days.push({ dayNumber: i, date: currDate, dateStr, isCurrentMonth: true, isSelected, isToday });
    }

    // Next month trailing days to complete 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      const dateStr = nextDate.toISOString().split('T')[0];
      days.push({ dayNumber: i, date: nextDate, dateStr, isCurrentMonth: false });
    }

    return days;
  }, [year, month, selectedDate]);

  // Events on selected day
  const selectedDateStr = selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` : '';
  const selectedDayEvents = events.filter((e) => e.dateStr === selectedDateStr);

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const newEvt = {
      id: Date.now().toString(),
      dateStr: selectedDateStr,
      title: eventTitle.trim(),
      time: eventTime,
      type: eventType,
      color: eventType === 'dispatch' ? 'bg-indigo-600 text-white' : eventType === 'finance' ? 'bg-emerald-600 text-white' : eventType === 'sale' ? 'bg-rose-500 text-white' : 'bg-sky-500 text-white',
    };

    setEvents([newEvt, ...events]);
    setEventTitle('');
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  return (
    <div className="p-3 sm:p-6 lg:p-8 space-y-6 min-h-screen text-slate-700 dark:text-slate-200 transition-colors">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Dispatch & Logistics Calendar</h1>
          <p className="text-xs text-slate-400 mt-0.5">Interactive pickup planning, COD reconciliations, and sale campaigns</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={goToToday}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition"
          >
            Today
          </button>

          {/* View Switcher */}
          <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400">
            {['Month', 'Week', 'Day'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg transition ${
                  viewMode === mode ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-md transition"
          >
            <Plus size={15} />
            <span>Schedule Event</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Interactive Panel: Selected Date & Scheduled Items */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">Selected Date</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', weekday: 'short' }) : 'Pick a date'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition"
                title="Add event for this day"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Selected Day Events List */}
            <div className="space-y-2.5">
              {selectedDayEvents.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs bg-slate-50/50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <CalendarIcon size={22} className="mx-auto mb-1.5 opacity-40" />
                  <p className="font-semibold">No logistics scheduled on this day.</p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="text-indigo-600 dark:text-indigo-400 text-[11px] font-bold mt-1.5 hover:underline"
                  >
                    + Schedule pickup or task
                  </button>
                </div>
              ) : (
                selectedDayEvents.map((evt) => (
                  <div key={evt.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className={`inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded ${evt.color}`}>
                        {evt.type.toUpperCase()}
                      </span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{evt.title}</p>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock size={11} /> {evt.time}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                      title="Delete event"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Upcoming Summary */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">All Upcoming ({events.length})</span>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {events.map((evt) => (
                  <div 
                    key={evt.id} 
                    onClick={() => setSelectedDate(new Date(evt.dateStr))}
                    className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs transition"
                  >
                    <div className="truncate flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                      <span className="truncate text-slate-700 dark:text-slate-300 font-medium">{evt.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">{evt.dateStr}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Calendar View Container */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
          
          {/* Navigation Month Header */}
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {monthNames[month]} {year}
              </h2>
            </div>
            
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button 
                onClick={prevMonth}
                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                title="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={nextMonth}
                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                title="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Month View Grid */}
          {viewMode === 'Month' && (
            <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 text-xs">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="bg-slate-50 dark:bg-slate-850 p-2 text-center font-bold text-slate-500 dark:text-slate-400 text-[11px]">
                  {d}
                </div>
              ))}

              {calendarGrid.map((c, i) => {
                const dayEvents = events.filter((e) => e.dateStr === c.dateStr);
                const isSelected = selectedDate && selectedDate.toDateString() === c.date.toDateString();

                return (
                  <div 
                    key={i} 
                    onClick={() => setSelectedDate(c.date)}
                    className={`min-h-[72px] sm:min-h-[84px] p-2 flex flex-col justify-between transition cursor-pointer select-none ${
                      isSelected
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500 inset-0 z-10'
                        : c.isCurrentMonth 
                          ? 'bg-white dark:bg-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-800/60' 
                          : 'bg-slate-50/40 dark:bg-slate-950 text-slate-300 dark:text-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-[11px] font-semibold ${
                        c.isToday 
                          ? 'w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow-xs' 
                          : isSelected 
                            ? 'font-black text-indigo-600 dark:text-indigo-400' 
                            : ''
                      }`}>
                        {c.dayNumber}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                      )}
                    </div>

                    <div className="space-y-1 mt-1">
                      {dayEvents.slice(0, 2).map((evt) => (
                        <div 
                          key={evt.id} 
                          className={`text-[9px] font-semibold px-1.5 py-0.5 rounded truncate ${evt.color}`}
                          title={`${evt.title} (${evt.time})`}
                        >
                          {evt.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="text-[8px] font-bold text-slate-400 block pl-1">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Week View */}
          {viewMode === 'Week' && (
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, idx) => {
                const dayDate = new Date(year, month, (selectedDate ? selectedDate.getDate() - selectedDate.getDay() : 1) + idx);
                const dayDateStr = dayDate.toISOString().split('T')[0];
                const dayEvents = events.filter((e) => e.dateStr === dayDateStr);
                const isSelected = selectedDate && selectedDate.toDateString() === dayDate.toDateString();

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(dayDate)}
                    className={`p-3 rounded-xl border transition cursor-pointer min-h-[160px] flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40'
                        : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{dayName}</p>
                      <p className="text-sm font-black text-slate-800 dark:text-slate-100">{dayDate.getDate()}</p>
                    </div>
                    <div className="space-y-1 mt-2 flex-1">
                      {dayEvents.map((evt) => (
                        <div key={evt.id} className={`text-[9px] font-semibold p-1 rounded ${evt.color}`}>
                          {evt.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Day View */}
          {viewMode === 'Day' && (
            <div className="space-y-2">
              <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-800/40 flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  Agenda for {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                </span>
                <span className="text-xs font-semibold text-slate-500">{selectedDayEvents.length} Events Scheduled</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map((hour) => {
                  const hourEvents = selectedDayEvents.filter((e) => e.time.includes(hour.slice(0, 2)));

                  return (
                    <div key={hour} className="p-3 flex items-start gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                      <span className="w-18 font-mono text-[11px] font-semibold text-slate-400">{hour}</span>
                      <div className="flex-1">
                        {hourEvents.length > 0 ? (
                          hourEvents.map((evt) => (
                            <div key={evt.id} className={`p-2 rounded-lg text-xs font-bold ${evt.color}`}>
                              {evt.title} ({evt.time})
                            </div>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-300 dark:text-slate-700 italic">No scheduled dispatch</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Schedule Logistics Event</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Date</label>
                <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono text-slate-800 dark:text-slate-100 font-bold">
                  {selectedDateStr}
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Event / Task Title</label>
                <input 
                  type="text" 
                  value={eventTitle} 
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Steadfast Courier Mega Dispatch" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Time</label>
                  <input 
                    type="text" 
                    value={eventTime} 
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="10:30 AM" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Category</label>
                  <select 
                    value={eventType} 
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  >
                    <option value="dispatch">Courier Pickup</option>
                    <option value="finance">COD Settlement</option>
                    <option value="sale">Marketing Sale</option>
                    <option value="inventory">Inventory Arrival</option>
                  </select>
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-md transition mt-2"
              >
                Add to Calendar
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
