'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  LayoutGrid, BarChart2, FileText, Calendar, 
  MessageSquare, Bell, Settings, Layers, LogOut 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { label: 'Dashboard', icon: LayoutGrid, href: '/dashboard' },
    { label: 'Analytics', icon: BarChart2, href: '/dashboard/analytics' },
    { label: 'Invoices', icon: FileText, href: '/dashboard/invoice' },
    { label: 'Schedule', icon: Layers, href: '/dashboard/schedule' },
    { label: 'Calendar', icon: Calendar, href: '/dashboard/calendar' },
    { label: 'Messages', icon: MessageSquare, href: '/dashboard/messages', badge: 3 },
    { label: 'Notifications', icon: Bell, href: '/dashboard/notification' },
    { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  const userName = session?.user?.name || 'Merchant Admin';
  const userEmail = session?.user?.email || 'merchant@shop.bd';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'M';

  const isCurrentActive = (href) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const handleLinkClick = () => {
    const toggle = document.getElementById('drawer-toggle');
    if (toggle && toggle.checked) {
      toggle.checked = false;
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 min-h-screen p-6 flex flex-col justify-between select-none shadow-xs transition-colors duration-200">
      <div>
        <Link 
          href="/dashboard" 
          onClick={handleLinkClick}
          className="flex items-center gap-3 px-2 mb-8 group"
        >
          <div className="relative p-0.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-500 shadow-md group-hover:scale-105 transition-transform duration-200">
            <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center p-1.5 overflow-hidden">
              <img 
                src="/logo.png" 
                alt="CourierSync BD" 
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-black text-slate-800 dark:text-white tracking-tight">CourierSync</span>
              <span className="text-[10px] font-black text-white bg-indigo-600 px-1.5 py-0.2 rounded font-mono">BD</span>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block -mt-0.5">Merchant Portal</span>
          </div>
        </Link>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const active = isCurrentActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-xs transition-all ${
                  active 
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <item.icon size={18} className={active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <Link 
            href="/dashboard/settings" 
            onClick={handleLinkClick}
            className="flex items-center gap-2.5 flex-1 overflow-hidden group"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-700">
              {session?.user?.image ? (
                <img src={session.user.image} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white text-[11px] font-bold">
                  {userInitials}
                </div>
              )}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                {userName}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{userEmail}</p>
            </div>
          </Link>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}