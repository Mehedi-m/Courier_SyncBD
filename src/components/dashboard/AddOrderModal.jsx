'use client';

import { useState } from 'react';
import { Sparkles, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AddOrderModal({ isOpen, onClose, onOrderAdded }) {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  if (!isOpen) return null;

  const sampleDhaka = `Rahim Uddin
01712345678
rahim.uddin@gmail.com
House 12, Road 5, Block C, Mirpur 10, Dhaka
COD: 1850 tk`;

  const sampleCtg = `Nusrat Jahan
01898765432
nusrat.ctg@yahoo.com
Flat 4B, Green Tower, Agrabad, Chittagong
COD: 2400 tk`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawChatText: rawText }),
      });
      const data = await res.json();
      if (data.success) {
        setRawText('');
        setStatusMsg({ type: 'success', text: 'Order extracted and saved to MongoDB!' });
        setTimeout(() => {
          if (onOrderAdded) onOrderAdded();
          if (onClose) onClose();
        }, 500);
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to save order.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Network request failed: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800 relative animate-in fade-in zoom-in-95 transition-colors">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">AI Messenger / Chat Order Extractor</h3>
            <p className="text-xs text-slate-400">Paste raw customer text from Facebook or WhatsApp</p>
          </div>
        </div>

        {statusMsg && (
          <div
            className={`my-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Raw Customer Message</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRawText(sampleDhaka)}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Dhaka Sample
                </button>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <button
                  type="button"
                  onClick={() => setRawText(sampleCtg)}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Chittagong Sample
                </button>
              </div>
            </div>

            <textarea
              rows={5}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste customer name, phone number, address, and COD amount here..."
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              required
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-bold text-slate-700 dark:text-slate-300">✨ Automated Extraction:</p>
            <p>Extracts 11-digit Bangladeshi mobile number, recipient name, address, district, and Cash On Delivery amount into a dispatch-ready order.</p>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !rawText.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 dark:shadow-none transition disabled:opacity-50"
            >
              {loading ? 'Extracting & Saving...' : 'Extract & Save Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}