'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, ShoppingBag, Calendar, UserPlus, CreditCard, 
  ShieldAlert, CheckCircle2, Trash2, Check, Truck, Loader2 
} from 'lucide-react';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setNotifications(json.data);
      }
    } catch (e) {
      console.error('Failed to load notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
    } catch (e) {}
  };

  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id || n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (e) {}
  };

  const deleteNotification = async (id) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id && n.id !== id));
    try {
      await fetch('/api/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (e) {}
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'Unread') return !n.isRead;
    if (activeTab === 'Orders') return n.category === 'Orders';
    if (activeTab === 'Invoices') return n.category === 'Invoices';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'dispatch':
        return <Truck size={16} className="text-indigo-600 dark:text-indigo-400" />;
      case 'order':
        return <ShoppingBag size={16} className="text-emerald-600 dark:text-emerald-400" />;
      case 'schedule':
        return <Calendar size={16} className="text-amber-500" />;
      case 'payment':
        return <CreditCard size={16} className="text-sky-500" />;
      case 'security':
        return <ShieldAlert size={16} className="text-rose-500" />;
      default:
        return <Bell size={16} className="text-indigo-600" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 min-h-screen text-slate-700 dark:text-slate-200 transition-colors">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Live parcel bookings, customer invoice dispatches, and COD reconciliations</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-2 rounded-xl transition"
          >
            <Check size={14} />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {['All', 'Unread', 'Orders', 'Invoices'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeTab === tab
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs font-bold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 size={24} className="animate-spin mx-auto text-indigo-600 mb-2" />
            <span>Loading notifications...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-400 text-xs">
            <Bell size={24} className="mx-auto mb-2 opacity-40" />
            <p className="font-semibold">No notifications found.</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n._id || n.id}
              className={`flex items-start justify-between p-4 rounded-2xl border transition-all ${
                n.isRead
                  ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                  : 'bg-indigo-50/25 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/40 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-100 dark:border-slate-700/60">
                  {getIcon(n.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{n.title}</h3>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-0.5">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 ml-3">
                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n._id || n.id)}
                    title="Mark as read"
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Check size={14} />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(n._id || n.id)}
                  title="Delete notification"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}