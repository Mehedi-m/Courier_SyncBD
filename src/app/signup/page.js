'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/components/global/ThemeToggle';
import CursorTrackingAuth from '@/components/visual/CursorTrackingAuth';
import ActionModal from '@/components/global/ActionModal';
import { Mail, Lock, User, Store, Phone, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2, Loader2, Check, X } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    storeName: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && !showSuccessModal) {
      router.push('/dashboard');
    }
  }, [status, router, showSuccessModal]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-sky-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);
  const passwordsMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;
  const storeSlug = formData.storeName
    ? formData.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
    : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your confirm password.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          storeName: formData.storeName,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Registration failed.');
        setLoading(false);
        return;
      }

      const signInRes = await signIn('credentials', {
        redirect: false,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      setLoading(false);
      setShowSuccessModal(true);
    } catch (err) {
      setErrorMsg('An unexpected error occurred during signup.');
      setLoading(false);
    }
  };

  const handleModalConfirm = () => {
    setShowSuccessModal(false);
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 transition-colors relative py-12 selection:bg-indigo-500 selection:text-white">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30">
        <ThemeToggle />
      </div>

      <ActionModal
        isOpen={showSuccessModal}
        title="Merchant Account Created!"
        message={`Welcome to CourierSync BD! Setting up courier integrations and workspace for ${formData.storeName || 'your store'}...`}
        confirmText="Launch My Merchant Dashboard"
        onConfirm={handleModalConfirm}
        autoCloseMs={1800}
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
              Free F-Commerce Logistics & Dispatch Automation
            </p>
          </div>
        </Link>
      </div>

      <div className="w-full max-w-xl flex justify-center -mb-2 z-10">
        <CursorTrackingAuth isPasswordFocused={isPasswordFocused} showPassword={showPassword} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 dark:shadow-none p-7 sm:p-9 space-y-5 transition-colors relative z-0"
      >
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Create Merchant Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Start automating Steadfast, Pathao & RedX dispatches in under 2 minutes
          </p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Your Full Name
              </label>
              <div className="relative group">
                <User size={15} className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Mehedi Hasan"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Shop Name
                </label>
                {storeSlug && (
                  <span className="text-[10px] font-mono text-indigo-500 dark:text-indigo-400">
                    /{storeSlug}
                  </span>
                )}
              </div>
              <div className="relative group">
                <Store size={15} className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  required
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="e.g. Urban Attire BD"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative group">
                <Mail size={15} className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="merchant@shop.bd"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Mobile Phone
              </label>
              <div className="relative group">
                <Phone size={15} className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01712345678"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {formData.password && (
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {passwordStrength.label}
                  </span>
                )}
              </div>
              <div className="relative group">
                <Lock size={15} className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {formData.password && (
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                    style={{ width: `${passwordStrength.score}%` }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Confirm Password
                </label>
                {formData.confirmPassword && (
                  <span className={`text-[10px] font-bold flex items-center gap-0.5 ${passwordsMatch ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {passwordsMatch ? <Check size={12} /> : <X size={12} />}
                    {passwordsMatch ? 'Match' : 'Mismatch'}
                  </span>
                )}
              </div>
              <div className="relative group">
                <Lock size={15} className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="password"
                  required
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3.5 px-4 rounded-2xl text-xs shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Creating Merchant Account...</span>
              </>
            ) : (
              <>
                <span>Create Free Merchant Account</span>
                <ArrowRight size={15} />
              </>
            )}
          </motion.button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline ml-1"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
