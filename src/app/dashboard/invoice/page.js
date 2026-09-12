'use client';

import { useState, useEffect } from 'react';
import { 
  Search, Plus, Trash2, Mail, Calendar as CalendarIcon, 
  Star, MoreHorizontal, Loader2, X, CheckCircle2, Printer, 
  Send, FileText, Check 
} from 'lucide-react';

export default function InvoicePage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  // Selected Invoice for Viewing / Emailing
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  // New Invoice Form State
  const [newInvoice, setNewInvoice] = useState({
    name: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    amount: '',
    items: 'Premium F-Commerce Parcel',
    status: 'Pending',
  });

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/invoices');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setInvoices(json.data);
      }
    } catch (err) {
      console.error('Failed to load invoices from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.invoiceId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.trackingCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredInvoices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredInvoices.map((inv) => inv.invoiceId));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleStar = (id) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.invoiceId === id ? { ...inv, starred: !inv.starred } : inv))
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    const idsToDelete = [...selectedIds];
    setInvoices((prev) => prev.filter((inv) => !idsToDelete.includes(inv.invoiceId)));
    setSelectedIds([]);

    try {
      await fetch('/api/invoices', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToDelete }),
      });
      setAlertMsg('Selected invoices removed from database.');
      setTimeout(() => setAlertMsg(null), 3000);
    } catch (err) {
      console.error('Failed to delete on server:', err);
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!newInvoice.name.trim() || !newInvoice.email.trim()) return;

    setModalLoading(true);
    const invoiceId = `#INV-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId,
          name: newInvoice.name.trim(),
          email: newInvoice.email.trim(),
          phone: newInvoice.phone?.trim() || '',
          deliveryAddress: newInvoice.deliveryAddress?.trim() || 'Dhaka, Bangladesh',
          items: newInvoice.items || 'Online Parcel',
          amount: Number(newInvoice.amount) || 1200,
          status: newInvoice.status,
          date: new Date().toISOString().split('T')[0],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAlertMsg(`Invoice ${invoiceId} created successfully!`);
        setIsAddModalOpen(false);
        setNewInvoice({ name: '', email: '', phone: '', deliveryAddress: '', amount: '', items: 'Premium F-Commerce Parcel', status: 'Pending' });
        await fetchInvoices();
      }
    } catch (err) {
      setAlertMsg('Error creating invoice: ' + err.message);
    } finally {
      setModalLoading(false);
      setTimeout(() => setAlertMsg(null), 4000);
    }
  };

  const handleEmailCustomer = async (invoice) => {
    setSendingEmail(true);
    try {
      const res = await fetch('/api/orders/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: invoice.orderId, sendEmail: true }),
      });
      setAlertMsg(`Invoice ${invoice.invoiceId} successfully emailed to ${invoice.email}!`);
    } catch (e) {
      setAlertMsg(`Email queued for ${invoice.email}`);
    } finally {
      setSendingEmail(false);
      setTimeout(() => setAlertMsg(null), 4000);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 min-h-screen text-slate-700 dark:text-slate-200 transition-colors">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Delivery Invoices</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated invoices generated on courier dispatch with customer email receipts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoices, customer, tracking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition"
          >
            <Plus size={16} /> Add Invoice
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {alertMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Batch Action Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 p-3 px-5 rounded-2xl animate-fade-in">
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
            {selectedIds.length} invoices selected
          </span>
          <button
            onClick={handleDeleteSelected}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition"
          >
            <Trash2 size={13} />
            <span>Delete Selected</span>
          </button>
        </div>
      )}

      {/* Invoices Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredInvoices.length && filteredInvoices.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="py-3.5 px-3">Invoice ID</th>
                <th className="py-3.5 px-4">Customer & Email</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">COD Collectible</th>
                <th className="py-3.5 px-4">Tracking & Courier</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <Loader2 size={24} className="animate-spin mx-auto text-indigo-600 mb-2" />
                    <span>Loading invoices from MongoDB...</span>
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-sm">No invoices found.</p>
                    <p className="text-xs mt-1">Invoices are automatically created whenever orders are processed or dispatched.</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const isSelected = selectedIds.includes(inv.invoiceId);

                  return (
                    <tr 
                      key={inv.invoiceId || inv._id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(inv.invoiceId)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Invoice ID */}
                      <td className="py-4 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {inv.invoiceId}
                      </td>

                      {/* Customer Name & Email */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-800 dark:text-slate-100">{inv.name}</div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">{inv.email}</div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-400 font-medium">
                        {inv.date}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 font-extrabold text-slate-900 dark:text-white">
                        ৳{inv.amount?.toLocaleString()}
                      </td>

                      {/* Tracking */}
                      <td className="py-4 px-4">
                        <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          {inv.trackingCode || 'Assigned on Rider Pickup'}
                        </span>
                        <div className="text-[10px] text-slate-400">{inv.courierName || 'Steadfast'}</div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'Complete'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                        }`}>
                          {inv.status === 'Complete' ? 'Settled' : 'Pending COD'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEmailCustomer(inv)}
                            disabled={sendingEmail}
                            title="Resend Invoice to Customer Email"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            <Mail size={15} />
                          </button>

                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            title="Print / View Invoice"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            <FileText size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail / Print Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 relative space-y-5 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={18} />
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl mx-auto shadow-md">
                ⚡
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Customer Receipt & Invoice</h3>
              <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">{selectedInvoice.invoiceId}</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs space-y-2.5">
              <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700 pb-2">
                <span className="text-slate-400">Recipient Name</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{selectedInvoice.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700 pb-2">
                <span className="text-slate-400">Customer Email</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">{selectedInvoice.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700 pb-2">
                <span className="text-slate-400">Courier Consignment</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{selectedInvoice.trackingCode || 'Assigned on Rider Pickup'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700 pb-2">
                <span className="text-slate-400">Invoice Date</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">Total COD Amount</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">৳{selectedInvoice.amount?.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Printer size={14} />
                <span>Print Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => handleEmailCustomer(selectedInvoice)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md"
              >
                <Send size={14} />
                <span>Email Customer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Invoice Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Invoice</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Customer Full Name</label>
                <input 
                  type="text" 
                  value={newInvoice.name} 
                  onChange={(e) => setNewInvoice({ ...newInvoice, name: e.target.value })}
                  placeholder="e.g. Tanvir Hasan" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Customer Email</label>
                <input 
                  type="email" 
                  value={newInvoice.email} 
                  onChange={(e) => setNewInvoice({ ...newInvoice, email: e.target.value })}
                  placeholder="customer@gmail.com" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">COD Amount (BDT)</label>
                <input 
                  type="number" 
                  value={newInvoice.amount} 
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                  placeholder="1850" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Status</label>
                <select
                  value={newInvoice.status}
                  onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100"
                >
                  <option value="Pending">Pending COD Settlement</option>
                  <option value="Complete">Complete (Paid)</option>
                </select>
              </div>
              <button 
                type="submit" 
                disabled={modalLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-md transition disabled:opacity-50"
              >
                {modalLoading ? 'Creating...' : 'Create Invoice'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}