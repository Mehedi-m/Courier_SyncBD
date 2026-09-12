'use client';

import { useState } from 'react';
import { 
  Plus, Search, Calendar as CalendarIcon, Clock, MapPin, 
  Trash2, ChevronLeft, ChevronRight, X, CheckCircle2, Truck 
} from 'lucide-react';

const initialSchedules = [
  { id: '1', date: '14 Dec, 2026', time: '10:30 AM', location: 'Steadfast Hub Mirpur Pickup Batch' },
  { id: '2', date: '15 Dec, 2026', time: '02:00 PM', location: 'Pathao Express Rider Collection' },
  { id: '3', date: '17 Dec, 2026', time: '11:00 AM', location: 'Weekly COD Settlement Reconciliation' },
  { id: '4', date: '19 Dec, 2026', time: '04:30 PM', location: 'Warehouse Packaging & Sorting' },
  { id: '5', date: '21 Dec, 2026', time: '01:00 PM', location: 'Merchant Supplier Restock Delivery' },
];

const dispatchTeam = [
  { id: 1, name: 'Tanvir Ahmed', role: 'Dispatch Lead', phone: '01711223344' },
  { id: 2, name: 'Mehedi Hasan', role: 'Operations Manager', phone: '01899887766' },
  { id: 3, name: 'Sadia Rahman', role: 'Customer Support', phone: '01555667788' },
];

export default function SchedulePage() {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [selectedIds, setSelectedIds] = useState([]);
  const [peopleQuery, setPeopleQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  const [newSchedule, setNewSchedule] = useState({
    location: '',
    date: '16 Dec, 2026',
    time: '10:00 AM',
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === schedules.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(schedules.map((s) => s.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = (id) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    setAlertMsg('Schedule item deleted.');
    setTimeout(() => setAlertMsg(null), 3000);
  };

  const handleCreateSchedule = (e) => {
    e.preventDefault();
    if (!newSchedule.location.trim()) return;

    const item = {
      id: Date.now().toString(),
      date: newSchedule.date,
      time: newSchedule.time,
      location: newSchedule.location.trim(),
    };

    setSchedules([item, ...schedules]);
    setIsModalOpen(false);
    setNewSchedule({ location: '', date: '16 Dec, 2026', time: '10:00 AM' });
    setAlertMsg('New dispatch schedule created successfully.');
    setTimeout(() => setAlertMsg(null), 3000);
  };

  const filteredPeople = dispatchTeam.filter((p) =>
    p.name.toLowerCase().includes(peopleQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 min-h-screen text-slate-700 dark:text-slate-200 transition-colors">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Courier Dispatch Schedules</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage rider collection windows, bulk pickup batches, and logistics tasks</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition"
        >
          <Plus size={16} /> Add Schedule
        </button>
      </div>

      {alertMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} />
          <span>{alertMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-5">
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition"
            >
              <Plus size={16} /> Schedule Rider Batch
            </button>

            {/* Team Members List */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">Logistics Personnel</h3>
                <span className="text-[10px] text-slate-400">{dispatchTeam.length} Members</span>
              </div>

              <div className="space-y-2">
                {filteredPeople.map((person) => (
                  <div key={person.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 text-white text-xs font-bold flex items-center justify-center">
                        {person.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{person.name}</p>
                        <p className="text-[10px] text-slate-400">{person.role}</p>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">{person.phone}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Schedule Items List */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Active Pickup Batches</h2>
            <span className="text-xs text-slate-400">{schedules.length} Items Scheduled</span>
          </div>

          <div className="space-y-3">
            {schedules.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                    <Truck size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{item.location}</h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1"><CalendarIcon size={12} /> {item.date}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {item.time}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  title="Remove schedule"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">New Dispatch Schedule</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Pickup Location / Hub</label>
                <input 
                  type="text" 
                  value={newSchedule.location} 
                  onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value })}
                  placeholder="e.g. Steadfast Gulshan Hub Express" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Date</label>
                <input 
                  type="text" 
                  value={newSchedule.date} 
                  onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Time Window</label>
                <input 
                  type="text" 
                  value={newSchedule.time} 
                  onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-md transition"
              >
                Create Schedule
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}