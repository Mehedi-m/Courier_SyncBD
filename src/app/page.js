'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import ThemeToggle from '@/components/global/ThemeToggle';
import ThreeDParcel from '@/components/visual/ThreeDParcel';
import { 
  Truck, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, 
  Zap, BarChart3, MessageSquare, Layers, Lock, Star, Mail, FileText 
} from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 sm:px-8 lg:px-12 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative p-0.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-500 shadow-md group-hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 p-1.5 flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="CourierSync BD Logo" className="w-full h-full object-contain filter drop-shadow-xs" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">CourierSync</span>
                <span className="text-[10px] font-black text-white bg-indigo-600 px-1.5 py-0.2 rounded font-mono">BD</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block -mt-0.5">Automated Courier Dispatch</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">How It Works</a>
            <a href="#invoicing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Auto Invoicing</a>
            <a href="#partners" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Courier Partners</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {status === 'authenticated' ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition"
                >
                  <span>Dashboard</span>
                  <ArrowRight size={14} />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-xs font-semibold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 px-2 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition hover:scale-102"
                >
                  <span>Start Free</span>
                  <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Interactive 3D Component */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-8 lg:px-12 bg-gradient-to-b from-white via-indigo-50/20 to-slate-50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-none">
              Turn Facebook Chat Orders into <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">
                1-Click Dispatches & Invoices
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Stop manually copy-pasting customer phone numbers, addresses, and COD amounts. 
              Extract order data instantly with AI, dispatch directly to <strong>Steadfast</strong> and <strong>Pathao</strong>, and automatically email formatted delivery invoices to your customers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href={status === 'authenticated' ? '/dashboard' : '/signup'}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3.5 px-8 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none transition hover:-translate-y-0.5"
              >
                <span>{status === 'authenticated' ? 'Open Merchant Dashboard' : 'Get Started Free • No Subscription'}</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 font-bold text-sm py-3.5 px-7 rounded-2xl shadow-2xs transition"
              >
                <span>Live Demo Sign In</span>
              </Link>
            </div>

            {/* Micro Benefits Row */}
            <div className="grid grid-cols-3 gap-4 pt-4 text-center lg:text-left border-t border-slate-200/60 dark:border-slate-800/80">
              <div>
                <p className="text-xl font-black text-slate-900 dark:text-white">0%</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Subscription Cost</p>
              </div>
              <div>
                <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">1-Click</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Steadfast Dispatch</p>
              </div>
              <div>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">Instant</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Customer Invoice Email</p>
              </div>
            </div>
          </div>

          {/* Right Hero: Interactive 3D Parcel Box */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <ThreeDParcel />
          </div>

        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Everything Your F-Commerce Shop Needs to Scale
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Eliminate shipping errors, prevent fake orders, and speed up COD returns by 3x.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4 hover:border-indigo-200 dark:hover:border-indigo-800 transition">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-bold text-xl">
              <Zap size={22} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Messenger Parser</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Simply paste messy customer messages from Facebook or WhatsApp. Our parser extracts the customer name, 11-digit mobile number, full address, district, and COD amount in milliseconds.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4 hover:border-indigo-200 dark:hover:border-indigo-800 transition">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center font-bold text-xl">
              <Truck size={22} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">1-Click Dispatch API</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No need to login to multiple courier merchant portals. Click Dispatch and we automatically send the order to Steadfast or Pathao, fetch the consignment tracking ID, and generate printable shipping labels.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4 hover:border-indigo-200 dark:hover:border-indigo-800 transition">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center font-bold text-xl">
              <BarChart3 size={22} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Real-Time COD Analytics</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Keep tight control over cash-on-delivery payments. Dynamic Recharts dashboard tracks weekly volume, settled payments, and courier performance directly from your live database.
            </p>
          </div>

        </div>
      </section>

      {/* Auto Invoicing Feature Section */}
      <section id="invoicing" className="py-16 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 px-4 sm:px-8 lg:px-12 transition-colors">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1 rounded-full">
              <FileText size={14} />
              <span>Automated Billing & Receipt</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Instant Invoices Sent to Customer Email
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Whenever you process an order or book a courier dispatch, CourierSync BD automatically creates a clean, branded invoice and emails it straight to your customer with live consignment tracking codes and COD payment instructions.
            </p>
            <div className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Branded invoice receipts with merchant shop name</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Real-time Steadfast and Pathao tracking links</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Printable packing slips for physical parcel boxes</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/70 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-indigo-500" />
                <span className="font-bold text-xs text-slate-800 dark:text-slate-100">Customer Invoice Notification</span>
              </div>
              <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">Delivered</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <p><strong>To:</strong> rahim.uddin88@gmail.com</p>
              <p><strong>Subject:</strong> Order Dispatched & Invoice #INV-108200</p>
              <p><strong>Consignment:</strong> SF-884920 (Steadfast)</p>
              <p><strong>Amount:</strong> ৳1,850 Cash on Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Free Unlocked Access Banner (Replaces Paid Pricing) */}
      <section className="py-20 px-4 sm:px-8 text-center bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black">All Features Free for Bangladeshi Merchants</h2>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl mx-auto">
            Enjoy unlimited parcel dispatches, automated customer email invoices, AI Messenger chat extractor, and real-time COD reconciliation without any monthly charges.
          </p>
          <div className="pt-3">
            <Link
              href={status === 'authenticated' ? '/dashboard' : '/signup'}
              className="inline-flex items-center gap-2 bg-white text-indigo-900 hover:bg-indigo-50 font-extrabold text-sm py-3.5 px-8 rounded-2xl shadow-xl transition hover:scale-102"
            >
              <span>{status === 'authenticated' ? 'Open Dashboard' : 'Get Started Free Now'}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 py-10 px-4 sm:px-8 lg:px-12 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-white font-bold">
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 p-1 flex items-center justify-center shadow-xs">
              <img src="/logo.png" alt="CourierSync Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <span className="text-sm font-black tracking-tight">CourierSync BD</span>
          </div>
          <div>
            © {new Date().getFullYear()} CourierSync BD. Developed By <b>Md. Mehedi Hasan</b>.
          </div>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-white transition">Sign In</Link>
            <Link href="/signup" className="hover:text-white transition">Sign Up</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}