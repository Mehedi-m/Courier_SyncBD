'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  User, Lock, Truck, CheckSquare, ShieldCheck, 
  Key, AlertCircle, CheckCircle2, Eye, EyeOff, Save, Plus, ExternalLink 
} from 'lucide-react';

const defaultTasks = [
  { id: '1', title: 'Verify Steadfast API credentials in settings', completed: true, priority: 'High' },
  { id: '2', title: 'Test 1-Click order parse from Facebook chat', completed: true, priority: 'High' },
  { id: '3', title: 'Automate invoice email to customer on parcel dispatch', completed: true, priority: 'Medium' },
  { id: '4', title: 'Reconcile weekly COD payments from delivered parcels', completed: false, priority: 'High' },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form State
  const [profile, setProfile] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    storeName: '',
    address: '',
    city: 'Dhaka',
    steadfastApiKey: '',
    steadfastSecretKey: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  // Tasks Preview State
  const [tasks, setTasks] = useState(defaultTasks);

  // Load user profile from API
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        if (data.success && data.user) {
          setProfile((prev) => ({
            ...prev,
            name: data.user.name || prev.name,
            email: data.user.email || prev.email,
            phone: data.user.phone || '',
            storeName: data.user.storeName || '',
            address: data.user.address || '',
            city: data.user.city || 'Dhaka',
            steadfastApiKey: data.user.steadfastApiKey || '',
            steadfastSecretKey: data.user.steadfastSecretKey || '',
          }));
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    }
    loadProfile();
  }, [session]);

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success) {
        setProfileMsg({ type: 'success', text: 'Merchant profile and shop details updated successfully!' });
      } else {
        setProfileMsg({ type: 'error', text: data.error || 'Failed to update profile.' });
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: 'Error saving profile: ' + err.message });
    } finally {
      setProfileLoading(false);
      setTimeout(() => setProfileMsg(null), 4000);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ type: 'error', text: data.error || 'Failed to update password.' });
      }
    } catch (err) {
      setPasswordMsg({ type: 'error', text: 'Error changing password: ' + err.message });
    } finally {
      setPasswordLoading(false);
      setTimeout(() => setPasswordMsg(null), 4000);
    }
  };

  const toggleTaskCompleted = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 min-h-screen text-slate-700 dark:text-slate-200 transition-colors">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings & Account</h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage merchant profile, Steadfast API keys, and security credentials</p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 overflow-x-auto pb-px">
        {[
          { id: 'profile', label: 'Profile & Shop', icon: User },
          { id: 'courier', label: 'Courier APIs', icon: Truck },
          { id: 'password', label: 'Password & Security', icon: Lock },
          { id: 'tasks', label: 'Logistics Checklist', icon: CheckSquare },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                active
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <tab.icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Profile & Shop */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="max-w-3xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
              🏪
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Merchant Shop Profile</h2>
              <p className="text-xs text-slate-400">Used for customer invoice receipts and courier pickup labels</p>
            </div>
          </div>

          {profileMsg && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
                profileMsg.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
              }`}
            >
              {profileMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Merchant Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Email Address (Read Only)</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">F-Commerce Shop Name</label>
              <input
                type="text"
                value={profile.storeName}
                onChange={(e) => setProfile({ ...profile, storeName: e.target.value })}
                placeholder="e.g. Trendy Lifestyle BD"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Merchant Contact Phone</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="01712345678"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Shop / Warehouse Pickup Address</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                placeholder="House 12, Road 4, Sector 3, Uttara, Dhaka"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={profileLoading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition disabled:opacity-50"
            >
              <Save size={14} />
              <span>{profileLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Courier APIs */}
      {activeTab === 'courier' && (
        <form onSubmit={handleProfileSubmit} className="max-w-3xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
              <Key size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Steadfast Courier API Integration</h2>
              <p className="text-xs text-slate-400">Connect your Steadfast merchant portal keys for 1-click parcel dispatches</p>
            </div>
          </div>

          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p className="font-bold text-indigo-900 dark:text-indigo-300">How to get your Steadfast Keys:</p>
            <p>1. Log in to your Steadfast Courier Merchant Portal (portal.steadfast.com.bd).</p>
            <p>2. Navigate to Settings → API Documentation.</p>
            <p>3. Copy your <strong>Api-Key</strong> and <strong>Secret-Key</strong> and paste below.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Steadfast API Key</label>
              <input
                type="text"
                value={profile.steadfastApiKey}
                onChange={(e) => setProfile({ ...profile, steadfastApiKey: e.target.value })}
                placeholder="Paste Steadfast Api-Key"
                className="w-full font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Steadfast Secret Key</label>
              <input
                type="password"
                value={profile.steadfastSecretKey}
                onChange={(e) => setProfile({ ...profile, steadfastSecretKey: e.target.value })}
                placeholder="Paste Steadfast Secret-Key"
                className="w-full font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={profileLoading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition disabled:opacity-50"
            >
              <Save size={14} />
              <span>{profileLoading ? 'Saving...' : 'Save Courier Keys'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Password & Security */}
      {activeTab === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Change Password</h2>
              <p className="text-xs text-slate-400">Keep your merchant credentials secure</p>
            </div>
          </div>

          {passwordMsg && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
                passwordMsg.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
              }`}
            >
              {passwordMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 pr-9 text-slate-800 dark:text-slate-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-3 text-slate-400"
                >
                  {showCurrentPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">New Password</label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 pr-9 text-slate-800 dark:text-slate-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-3 text-slate-400"
                >
                  {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={passwordLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition disabled:opacity-50"
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      )}

      {/* Tab: Tasks Checklist */}
      {activeTab === 'tasks' && (
        <div className="max-w-3xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-2xs space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
              <CheckSquare size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">F-Commerce Logistics Checklist</h2>
              <p className="text-xs text-slate-400">Key operational tasks to ensure 100% successful COD delivery rate</p>
            </div>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTaskCompleted(task.id)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                  task.completed
                    ? 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 opacity-80'
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className={`text-xs font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                    {task.title}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  task.priority === 'High' ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600'
                }`}>
                  {task.priority} Priority
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}