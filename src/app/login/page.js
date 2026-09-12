'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/components/global/ThemeToggle';
import CursorTrackingAuth from '@/components/visual/CursorTrackingAuth';
import ActionModal from '@/components/global/ActionModal';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [demoFeedback, setDemoFeedback] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && !showSuccessModal) {
      router.push('/dashboard');
    }
  }, [status, router, showSuccessModal]);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const messageParam = searchParams.get('message');
    if (errorParam === 'CredentialsSignin') {
      setErrorMsg('Invalid email or password. Please check your credentials.');
    } else if (errorParam) {
      setErrorMsg(`Authentication notice: ${errorParam}`);
    }
    if (messageParam === 'registered') {
      setSuccessMsg('Account registered successfully! Please sign in with your credentials.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      });

      if (res?.error) {
        setErrorMsg(res.error);
        setLoading(false);
      } else if (res?.ok) {
        setLoading(false);
        setShowSuccessModal(true);
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('hasan@gmail.com');
    setPassword('123456');
    setErrorMsg('');
    setDemoFeedback(true);
    setTimeout(() => setDemoFeedback(false), 2000);
  };

  const handleModalConfirm = () => {
    setShowSuccessModal(false);
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 transition-colors relative selection:bg-indigo-500 selection:text-white">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30">
        <ThemeToggle />
      </div>

      <ActionModal
        isOpen={showSuccessModal}
        title="Authentication Successful!"
        message="Welcome back! Synchronizing your merchant store, live orders, and courier dispatches..."
        confirmText="Go to Dashboard Now"
        onConfirm={handleModalConfirm}
        autoCloseMs={1600}
      />

      <div className="mb-4 text-center z-10">
        <Link href="/" className="inline-flex items-center gap-3.5 group">
          <div className="relative p-1 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-500 shadow-xl shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center p-2 overflow-hidden">
              <img
                src="/logo.png"
                alt="CourierSync BD Logo"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                CourierSync
              </span>
              <span className="text-xs font-black text-white bg-indigo-600 px-2 py-0.5 rounded-md tracking-wider">
                BD
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
              F-Commerce Logistics & Courier Automation
            </p>
          </div>
        </Link>
      </div>

      <div className="w-full max-w-md flex justify-center -mb-2 z-10">
        <CursorTrackingAuth isPasswordFocused={isPasswordFocused} showPassword={showPassword} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 dark:shadow-none p-7 sm:p-9 space-y-5 transition-colors relative z-0"
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Merchant Login
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Access your courier dispatch and invoicing hub
            </p>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Auto-fill demo merchant credentials"
          >
            <Sparkles size={13} className={demoFeedback ? 'text-amber-500 animate-spin' : ''} />
            <span>{demoFeedback ? 'Filled!' : 'Demo Login'}</span>
          </button>
        </div>

        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2.5 p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-700 dark:text-rose-300 text-xs"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span className="font-medium">{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2.5 p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-700 dark:text-emerald-300 text-xs"
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
              <span className="font-medium">{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Mail size={16} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="merchant@shop.bd"
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3 px-4 rounded-2xl text-xs shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={15} />
              </>
            )}
          </motion.button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don't have a merchant account?{' '}
            <Link
              href="/signup"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline ml-1"
            >
              Create free account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs text-slate-500">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
