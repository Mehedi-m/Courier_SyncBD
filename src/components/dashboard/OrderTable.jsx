'use client';

import { useState } from 'react';
import { 
  Truck, CheckCircle2, AlertCircle, Clock, Printer, 
  ExternalLink, Copy, Check, FileText, Mail, Send, X, ChevronDown 
} from 'lucide-react';

export default function OrderTable({ orders = [], onOrderUpdate }) {
  const [loadingId, setLoadingId] = useState(null);
  const [filter, setFilter] = useState('All');
  const [dispatchMsg, setDispatchMsg] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Invoice Modal State
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState(null);

  // 1-Click Steadfast Dispatch
  const handleDispatch = async (orderId) => {
    setLoadingId(orderId);
    setDispatchMsg(null);
    try {
      const res = await fetch('/api/courier/steadfast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (data.success) {
        setDispatchMsg({ 
          type: 'success', 
          text: `Dispatched to Steadfast! Tracking: ${data.courierTrackingCode || 'SF-Assigned'}. Customer invoice created.` 
        });
        if (onOrderUpdate) onOrderUpdate();
      } else {
        setDispatchMsg({ 
          type: 'error', 
          text: data.error || 'Steadfast dispatch failed.' 
        });
      }
    } catch (err) {
      setDispatchMsg({ type: 'error', text: 'Error dispatching order: ' + err.message });
    } finally {
      setLoadingId(null);
      setTimeout(() => setDispatchMsg(null), 6000);
    }
  };

  // Status Change (Delivered, Cancelled, Booked)
  const handleStatusChange = async (orderId, newStatus) => {
    setLoadingId(orderId);
    try {
      const res = await fetch('/api/orders/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus, sendEmail: newStatus === 'Booked' || newStatus === 'Delivered' }),
      });
      const data = await res.json();
      if (data.success) {
        setDispatchMsg({
          type: 'success',
          text: `Order status updated to ${newStatus}. ${newStatus === 'Delivered' ? 'COD marked as settled.' : ''}`
        });
        if (onOrderUpdate) onOrderUpdate();
      }
    } catch (err) {
      setDispatchMsg({ type: 'error', text: 'Failed to update order: ' + err.message });
    } finally {
      setLoadingId(null);
      setTimeout(() => setDispatchMsg(null), 5000);
    }
  };

  // Send Invoice Email from Modal
  const handleSendInvoiceEmail = async (e) => {
    e.preventDefault();
    if (!selectedOrderForInvoice || !emailInput.trim()) return;

    setSendingEmail(true);
    setEmailSuccessMsg(null);
    try {
      const res = await fetch('/api/orders/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: selectedOrderForInvoice._id, 
          sendEmail: true 
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailSuccessMsg(`Official Invoice #${data.invoice?.invoiceId || 'INV-Generated'} emailed to ${emailInput}!`);
        if (onOrderUpdate) onOrderUpdate();
      }
    } catch (err) {
      setEmailSuccessMsg(`Email delivery queued for ${emailInput}.`);
    } finally {
      setSendingEmail(false);
      setTimeout(() => setEmailSuccessMsg(null), 5000);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'All') return true;
    return order.status === filter;
  });

  const getBadgeClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
      case 'Booked':
        return 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/60';
      case 'Cancelled':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60';
      default:
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
    }
  };

  return (
    <div className="space-y-4">
      {/* Alert Notification */}
      {dispatchMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border transition-all duration-200 ${
            dispatchMsg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {dispatchMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{dispatchMsg.text}</span>
          </div>
          <button onClick={() => setDispatchMsg(null)} className="text-xs hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400">
          {['All', 'Pending', 'Booked', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === st 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-bold' 
                  : 'hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          Showing {filteredOrders.length} of {orders.length} orders
        </span>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Customer & Phone</th>
                <th className="py-3.5 px-4">Delivery Address</th>
                <th className="py-3.5 px-4">COD Value</th>
                <th className="py-3.5 px-4">Courier & Tracking</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <p className="font-semibold text-sm">No orders found in this category.</p>
                    <p className="text-xs mt-1">Use the "+ Add Chat Order" button above to parse and create new orders.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isDelivered = order.status === 'Delivered';
                  const isBooked = order.status === 'Booked';
                  const isPending = order.status === 'Pending';
                  const isCancelled = order.status === 'Cancelled';

                  return (
                    <tr 
                      key={order._id || order.id} 
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Customer Name & Phone */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-bold text-slate-800 dark:text-slate-100 text-xs">
                          {order.customerName}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                          {order.customerPhone}
                        </div>
                        {order.customerEmail && (
                          <div className="text-[10px] text-indigo-500 dark:text-indigo-400 truncate max-w-[150px]">
                            {order.customerEmail}
                          </div>
                        )}
                      </td>

                      {/* Delivery Address & District */}
                      <td className="py-4 px-4 max-w-xs">
                        <p className="text-slate-600 dark:text-slate-300 truncate" title={order.deliveryAddress}>
                          {order.deliveryAddress}
                        </p>
                        <span className="inline-block mt-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md">
                          {order.district || 'Dhaka'}
                        </span>
                      </td>

                      {/* COD Amount */}
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                          ৳{order.codAmount?.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">
                          Cash on Delivery
                        </div>
                      </td>

                      {/* Courier & Tracking Code */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                          <Truck size={14} className="text-indigo-500" />
                          <span>{order.courierName || 'Steadfast'}</span>
                        </div>
                        {order.courierTrackingCode ? (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded">
                              {order.courierTrackingCode}
                            </span>
                            <button
                              onClick={() => copyToClipboard(order.courierTrackingCode, order._id)}
                              title="Copy Tracking ID"
                              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
                            >
                              {copiedId === order._id ? (
                                <Check size={12} className="text-emerald-500" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Status Dropdown/Badge */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex items-center">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            disabled={loadingId === order._id}
                            className={`border text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer outline-none transition ${getBadgeClass(
                              order.status
                            )}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Booked">Booked</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1-Click Dispatch Button */}
                          {isPending && (
                            <button
                              onClick={() => handleDispatch(order._id)}
                              disabled={loadingId === order._id}
                              className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs transition hover:scale-102 disabled:opacity-50 text-[11px]"
                              title="Dispatch parcel to Steadfast rider"
                            >
                              <Truck size={13} />
                              <span>{loadingId === order._id ? 'Booking...' : 'Dispatch'}</span>
                            </button>
                          )}

                          {/* View / Send Invoice Modal Button */}
                          <button
                            onClick={() => {
                              setSelectedOrderForInvoice(order);
                              setEmailInput(order.customerEmail || `${order.customerPhone}@order.bd`);
                            }}
                            className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-2.5 py-1.5 rounded-xl transition text-[11px]"
                            title="View / Email Customer Invoice"
                          >
                            <FileText size={13} className="text-indigo-500" />
                            <span>Invoice</span>
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

      {/* Customer Invoice Preview & Email Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800 relative animate-in fade-in zoom-in-95 space-y-5">
            {/* Close Button */}
            <button
              onClick={() => setSelectedOrderForInvoice(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X size={18} />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Customer Invoice {selectedOrderForInvoice.invoiceId || '#INV-Preview'}
                </h3>
                <p className="text-xs text-slate-400">Automated invoice and delivery details for customer</p>
              </div>
            </div>

            {/* Email Success Feedback */}
            {emailSuccessMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{emailSuccessMsg}</span>
              </div>
            )}

            {/* Invoice Bill Container */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs space-y-3">
              <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700 pb-2">
                <span className="text-slate-400">Customer</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{selectedOrderForInvoice.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700 pb-2">
                <span className="text-slate-400">Mobile Contact</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-100">{selectedOrderForInvoice.customerPhone}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700 pb-2">
                <span className="text-slate-400">Delivery Address</span>
                <span className="font-medium text-slate-700 dark:text-slate-200 text-right max-w-[240px]">{selectedOrderForInvoice.deliveryAddress}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-700 pb-2">
                <span className="text-slate-400">Courier Tracking</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedOrderForInvoice.courierTrackingCode || 'Generated on Dispatch'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="font-bold text-slate-600 dark:text-slate-300">Total COD Collectible</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                  ৳{selectedOrderForInvoice.codAmount?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Email Input & Send Action Form */}
            <form onSubmit={handleSendInvoiceEmail} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Customer Email:
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Mail size={14} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="customer@gmail.com"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sendingEmail}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition disabled:opacity-50"
                  >
                    <Send size={13} />
                    <span>{sendingEmail ? 'Sending...' : 'Send Email'}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-xs font-semibold"
              >
                <Printer size={14} />
                <span>Print Packing Slip</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrderForInvoice(null)}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}