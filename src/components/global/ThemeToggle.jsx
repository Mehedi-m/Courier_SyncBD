'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme, mounted } = useTheme();

  const isDark = mounted ? theme === 'dark' : false;

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border ${
        isDark 
          ? 'bg-slate-800/80 hover:bg-slate-800 text-amber-300 border-slate-700/80 shadow-inner' 
          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80 shadow-2xs'
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {mounted ? (
          isDark ? (
            <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 scale-100 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 scale-100 text-indigo-600" />
          )
        ) : (
          <span className="w-4 h-4" />
        )}
      </div>
    </button>
  );
}

