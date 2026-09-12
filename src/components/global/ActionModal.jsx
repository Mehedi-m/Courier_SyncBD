'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function ActionModal({
  isOpen,
  title = 'Action Completed',
  message = 'Your action was processed successfully.',
  confirmText = 'Continue to Dashboard',
  onConfirm,
  autoCloseMs = 1800,
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / autoCloseMs) * 100);
      setProgress(pct);

      if (elapsed >= autoCloseMs) {
        clearInterval(interval);
        if (onConfirm) onConfirm();
      }
    }, 25);

    return () => clearInterval(interval);
  }, [isOpen, autoCloseMs, onConfirm]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
            onClick={onConfirm}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-6 overflow-hidden z-10"
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </motion.div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-1 -right-1 text-amber-500"
              >
                <Sparkles size={20} />
              </motion.div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                {message}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onConfirm}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3.5 px-6 rounded-2xl text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 cursor-pointer"
              >
                <span>{confirmText}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
