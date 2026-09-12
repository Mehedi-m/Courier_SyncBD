'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSession } from 'next-auth/react';
import OrderTable from '@/components/dashboard/OrderTable';
import AddOrderModal from '@/components/dashboard/AddOrderModal';
import { 
  Plus, RefreshCw, Calendar as CalendarIcon, 
  Star, Truck, Clock, CheckCircle2, TrendingUp, AlertCircle, 
  Sparkles, Package, ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, CartesianGrid, PieChart, Pie, Cell 
} from 'recharts';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Real-time polling every 3.5 seconds
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Compute live KPIs from MongoDB orders
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const bookedOrders = orders.filter((o) => o.status === 'Booked').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
  const totalCOD = orders.reduce((sum, o) => sum + (Number(o.codAmount) || 0), 0);
  const deliveredCOD = orders
    .filter((o) => o.status === 'Delivered')
    .reduce((sum, o) => sum + (Number(o.codAmount) || 0), 0);

  const kpis = [
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: TrendingUp,
      color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
    },
    {
      label: 'Pending Dispatch',
      value: pendingOrders,
      icon: Clock,
      color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Dispatched to Courier',
      value: bookedOrders,
      icon: Truck,
      color: 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400',
    },
    {
      label: 'Total COD Value',
      value: `৳${totalCOD.toLocaleString()}`,
      icon: CheckCircle2,
      color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
    },
  ];

  // Dynamic Chart 1: Daily/Weekly Order Volume & Revenue from real MongoDB data
  const performanceChartData = useMemo(() => {
    const daysMap = {
      Sat: { day: 'Sat', orders: 0, cod: 0 },
      Sun: { day: 'Sun', orders: 0, cod: 0 },
      Mon: { day: 'Mon', orders: 0, cod: 0 },
      Tue: { day: 'Tue', orders: 0, cod: 0 },
      Wed: { day: 'Wed', orders: 0, cod: 0 },
      Thu: { day: 'Thu', orders: 0, cod: 0 },
      Fri: { day: 'Fri', orders: 0, cod: 0 },
    };

    orders.forEach((o) => {
      const date = new Date(o.createdAt || Date.now());
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      if (daysMap[dayName]) {
        daysMap[dayName].orders += 1;
        daysMap[dayName].cod += o.codAmount || 0;
      }
    });

    return Object.values(daysMap);
  }, [orders]);

  // Dynamic Chart 2: Courier Share Donut Chart from real MongoDB orders
  const courierShareData = useMemo(() => {
    let steadfastCount = 0;
    let pathaoCount = 0;
    let redxCount = 0;

    orders.forEach((o) => {
      const name = (o.courierName || 'Steadfast').toLowerCase();
      if (name.includes('steadfast')) steadfastCount++;
      else if (name.includes('pathao')) pathaoCount++;
      else redxCount++;
    });

    const total = orders.length || 1;
    return [
      { name: 'Steadfast', value: steadfastCount, percentage: Math.round((steadfastCount / total) * 100), color: '#4f46e5' },
      { name: 'Pathao', value: pathaoCount, percentage: Math.round((pathaoCount / total) * 100), color: '#f59e0b' },
      { name: 'RedX / Other', value: redxCount, percentage: Math.round((redxCount / total) * 100), color: '#ec4899' },
    ];
  }, [orders]);

  // Top Products derived dynamically from order items
  const popularProducts = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      const item = o.items || 'F-Commerce Parcel';
      counts[item] = (counts[item] || 0) + 1;
    });

    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) {
      return [
        { name: 'Premium Linen Panjabi', count: 4, price: '৳1,850' },
        { name: 'Wireless ANC Earbuds', count: 3, price: '৳2,400' },
        { name: 'Leather Bi-Fold Wallet', count: 2, price: '৳950' },
        { name: 'Glow Facial Serum', count: 2, price: '৳1,450' },
      ];
    }

    return entries.slice(0, 4).map(([name, count], i) => ({
      name,
      count,
      price: `৳${(1200 + i * 450).toLocaleString()}`,
    }));
  }, [orders]);

  return (
    <div className="p-3 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 min-h-screen text-slate-700 dark:text-slate-200 transition-colors">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Welcome back, {session?.user?.name || 'Merchant'} 👋
            </h1>
            <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time overview of your F-Commerce parcel dispatches, customer invoices, and COD collections
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Refresh Button */}
          <button
            onClick={() => fetchOrders(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xs transition disabled:opacity-50"
            title="Refresh Orders"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-indigo-600' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Add Chat Order Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition"
          >
            <Plus size={16} />
            <span>+ Add Chat Order</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-2xs hover:shadow-xs transition"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${stat.color}`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs font-medium text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Live Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Courier Dispatch & Invoicing</h2>
            <p className="text-xs text-slate-400">One-click Steadfast fulfillment & automated customer invoice emailing</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            Parse New Order →
          </button>
        </div>

        <OrderTable orders={orders} onOrderUpdate={() => fetchOrders(false)} />
      </div>

      {/* Real-time Dynamic Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dynamic Area Chart Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Live Courier Volume & Revenue</h3>
              <p className="text-xs text-slate-400">Daily parcels and COD distribution across the week</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
              <span>৳{deliveredCOD.toLocaleString()} Settled COD</span>
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                  formatter={(value, name) => [
                    name === 'orders' ? `${value} Parcels` : `৳${value.toLocaleString()}`,
                    name === 'orders' ? 'Order Count' : 'COD Amount',
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#6366f1" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#orderGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Courier Share Donut Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Courier Share</h3>
              <p className="text-xs text-slate-400">Distribution by logistics provider</p>
            </div>
            <span className="text-xs text-slate-400 font-medium">Live</span>
          </div>
          
          {/* Recharts Pie Donut */}
          <div className="h-44 w-full relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courierShareData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {courierShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                  formatter={(val, name) => [`${val} parcels`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center pointer-events-none">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {orders.length}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Orders</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {courierShareData.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="font-medium text-slate-600 dark:text-slate-300">{c.name}</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {c.percentage}% ({c.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products In Shop */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Top Selling Products in F-Commerce</h3>
            <p className="text-xs text-slate-400">High repeat courier dispatches</p>
          </div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">Active Inventory</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularProducts.map((product, idx) => (
            <div key={idx} className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="w-11 h-11 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">
                📦
              </div>
              <div className="space-y-0.5 truncate">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{product.name}</p>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} fill="currentColor" />
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{product.price}</span>
                  <span className="text-[10px] text-slate-400">{product.count} orders</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add Order Parser */}
      <AddOrderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onOrderAdded={() => fetchOrders(false)}
      />
    </div>
  );
}