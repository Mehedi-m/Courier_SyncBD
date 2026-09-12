'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/global/Sidebar';
import ThemeToggle from '@/components/global/ThemeToggle';
import { Menu, Bell } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  // Authentication check - redirect to login if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Automatically close mobile drawer when navigating to any other page
  useEffect(() => {
    const toggle = document.getElementById('drawer-toggle');
    if (toggle && toggle.checked) {
      toggle.checked = false;
    }
  }, [pathname]);

  // Fetch unread notifications count in real-time
  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const unread = json.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (e) {
      // quiet fallback
    }
  };

  useEffect(() => {
    loadNotifications();
    const timer = setInterval(loadNotifications, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="drawer lg:drawer-open bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen transition-colors duration-200">
      {/* Hidden checkbox controlling drawer state */}
      <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col min-h-screen w-full max-w-full min-w-0 overflow-x-hidden">
        {/* Top Header Navbar */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-3 sm:px-6 py-2.5 transition-colors w-full min-w-0">
          <div className="relative flex items-center justify-between gap-2 max-w-7xl mx-auto w-full min-w-0">
            
            {/* Left / Mobile Hamburger */}
            <div className="flex items-center gap-2 shrink-0 z-10">
              <label
                htmlFor="drawer-toggle"
                className="btn btn-square btn-ghost btn-sm drawer-button lg:hidden text-slate-600 dark:text-slate-300"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </label>

              {/* Desktop Brand / Breadcrumb */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm font-black text-slate-900 dark:text-white">CourierSync</span>
                <span className="text-xs text-slate-400">/</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Merchant Dashboard</span>
              </div>
            </div>

            {/* Mobile Centered Title - Perfectly Centered in Middle Space */}
            <div className="sm:hidden absolute inset-x-0 mx-auto text-center pointer-events-none flex items-center justify-center">
              <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
                Merchant Dashboard
              </span>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 z-10">
              {/* Quick Courier API Status Badge */}
              <div className="hidden md:inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 text-[11px] font-semibold py-1 px-2.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Steadfast API Live
              </div>

              {/* Dark / Night Mode Toggle */}
              <ThemeToggle />

              {/* Notifications Button with Real Number Count Badge */}
              <Link 
                href="/dashboard/notification"
                className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-black min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            </div>

          </div>
        </header>

        {/* Page Children Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Sidebar Drawer */}
      <div className="drawer-side z-40">
        <label htmlFor="drawer-toggle" aria-label="close sidebar" className="drawer-overlay"></label>
        <Sidebar />
      </div>
    </div>
  );
}