'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, Mail, Phone, MapPin, Edit, Trash2, X, 
  Camera, ShoppingBag, TrendingUp, Users, Award, ShieldCheck, CheckCircle2 
} from 'lucide-react';

export default function AnalyticsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    district: 'Dhaka',
  });

  const fetchOrders = async () => {
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
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Derive unique customer directory from actual MongoDB orders
  const customers = useMemo(() => {
    const map = {};

    orders.forEach((o) => {
      const phone = o.customerPhone || '01700000000';
      if (!map[phone]) {
        map[phone] = {
          id: phone,
          name: o.customerName,
          phone: o.customerPhone,
          email: o.customerEmail || `${o.customerPhone}@customer.order.bd`,
          address: o.deliveryAddress,
          district: o.district || 'Dhaka',
          ordersCount: 0,
          totalSpent: 0,
          lastOrderDate: o.createdAt,
          lastStatus: o.status,
          history: [],
        };
      }

      map[phone].ordersCount += 1;
      map[phone].totalSpent += Number(o.codAmount) || 0;
      map[phone].history.push({
        id: o._id,
        items: o.items || 'F-Commerce Parcel',
        amount: o.codAmount,
        status: o.status,
        date: new Date(o.createdAt).toLocaleDateString(),
        tracking: o.courierTrackingCode,
      });
    });

    return Object.values(map);
  }, [orders]);

  useEffect(() => {
    if (customers.length > 0 && !selectedCustomer) {
      setSelectedCustomer(customers[0]);
    }
  }, [customers, selectedCustomer]);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.includes(searchQuery) ||
      c.district?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // KPIs
  const totalCustomers = customers.length;
  const repeatCustomers = customers.filter((c) => c.ordersCount > 1).length;
  const repeatRate = totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0;
  const avgOrderValue = orders.length > 0
    ? Math.round(orders.reduce((sum, o) => sum + (o.codAmount || 0), 0) / orders.length)
    : 0;

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const newCust = {
      id: formData.phone,
      name: formData.name,
      phone: formData.phone,
      email: formData.email || `${formData.phone}@order.bd`,
      address: formData.address || 'Dhaka, Bangladesh',
      district: formData.district,
      ordersCount: 1,
      totalSpent: 1500,
      lastOrderDate: new Date(),
      lastStatus: 'Pending',
      history: [{ id: 'new-1', items: 'Manual Customer Entry', amount: 1500, status: 'Pending', date: 'Just now' }],
    };

    setSelectedCustomer(newCust);
    setIsAddingCustomer(false);
    setFormData({ name: '', email: '', phone: '', address: '', district: 'Dhaka' });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 min-h-screen text-slate-700 dark:text-slate-200 transition-colors">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Analytics & Directory</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real customer insights, lifetime value (LTV), and delivery history across Bangladesh
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            />
          </div>
          <button 
            onClick={() => setIsAddingCustomer(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition"
          >
            <Plus size={16} /> Add Member
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 dark:text-white">{totalCustomers}</p>
            <p className="text-xs font-medium text-slate-400">Total Unique Buyers</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 dark:text-white">{repeatRate}%</p>
            <p className="text-xs font-medium text-slate-400">Repeat Purchase Rate</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Award size={22} />
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 dark:text-white">৳{avgOrderValue.toLocaleString()}</p>
            <p className="text-xs font-medium text-slate-400">Average Order Value (AOV)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Customer Cards List */}
        <div className="lg:col-span-8 space-y-3">
          
          <div className="grid grid-cols-12 px-6 py-2 text-xs font-semibold text-slate-400">
            <span className="col-span-4">Customer Name</span>
            <span className="col-span-3">Phone & District</span>
            <span className="col-span-2 text-center">Orders</span>
            <span className="col-span-3 text-right">Total COD Spent</span>
          </div>

          <div className="space-y-2.5">
            {filteredCustomers.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-400 text-xs">
                No customer matching "{searchQuery}".
              </div>
            ) : (
              filteredCustomers.map((c) => {
                const isSelected = selectedCustomer?.id === c.id;

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    className={`relative grid grid-cols-12 items-center p-4 px-6 bg-white dark:bg-slate-900 rounded-2xl border transition cursor-pointer ${
                      isSelected 
                        ? 'border-indigo-500 shadow-sm ring-1 ring-indigo-500/20' 
                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Name & Avatar */}
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-100 block truncate">{c.name}</span>
                        <span className="text-[10px] text-slate-400 truncate block">{c.email}</span>
                      </div>
                    </div>

                    {/* Phone & District */}
                    <div className="col-span-3 text-xs">
                      <div className="font-mono font-medium text-slate-700 dark:text-slate-300">{c.phone}</div>
                      <span className="inline-block text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded mt-0.5">
                        {c.district}
                      </span>
                    </div>

                    {/* Order Count */}
                    <div className="col-span-2 text-center text-xs font-bold text-slate-800 dark:text-slate-200">
                      {c.ordersCount} {c.ordersCount === 1 ? 'order' : 'orders'}
                    </div>

                    {/* Total COD Spent */}
                    <div className="col-span-3 text-right">
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">
                        ৳{c.totalSpent.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Sidebar: Profile Detail View */}
        <div className="lg:col-span-4">
          {selectedCustomer ? (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-5">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-sm">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">{selectedCustomer.name}</h2>
                <div className="inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  <ShieldCheck size={12} />
                  <span>Verified F-Commerce Buyer</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-medium">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">Delivery Details</h3>
                
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Phone size={14} className="text-indigo-500 flex-shrink-0" />
                  <span className="font-mono">{selectedCustomer.phone}</span>
                </div>

                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Mail size={14} className="text-indigo-500 flex-shrink-0" />
                  <span className="truncate">{selectedCustomer.email}</span>
                </div>

                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <MapPin size={14} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                  <span>{selectedCustomer.address}</span>
                </div>
              </div>

              {/* Order History List */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">Recent Parcels</h3>
                  <span className="text-[10px] text-slate-400">{selectedCustomer.history?.length || 0} Records</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedCustomer.history?.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-800 dark:text-slate-200 truncate">{item.items}</span>
                        <span className="text-indigo-600 dark:text-indigo-400">৳{item.amount}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>{item.date}</span>
                        <span className={`font-semibold ${item.status === 'Delivered' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : null}
        </div>

      </div>

      {/* Add Member Modal */}
      {isAddingCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Customer Profile</h3>
              <button onClick={() => setIsAddingCustomer(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Customer Full Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Nusrat Jahan" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">11-Digit Mobile Number</label>
                <input 
                  type="text" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01712345678" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Email Address (Optional)</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="customer@gmail.com" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Delivery Address</label>
                <input 
                  type="text" 
                  value={formData.address} 
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House 12, Road 5, Mirpur, Dhaka" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-md transition"
              >
                Save Customer
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}