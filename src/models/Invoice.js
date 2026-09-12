import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
  invoiceId: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => `#INV-${Math.floor(100000 + Math.random() * 900000)}` 
  },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  deliveryAddress: { type: String },
  items: { type: String, default: 'F-Commerce Parcel' },
  trackingCode: { type: String },
  courierName: { type: String, default: 'Steadfast' },
  date: { 
    type: String, 
    default: () => new Date().toISOString().split('T')[0] 
  },
  amount: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Complete', 'Pending', 'Cancelled'], 
    default: 'Pending' 
  },
  starred: { type: Boolean, default: false },
  emailedToCustomer: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

InvoiceSchema.index({ createdAt: -1 });
InvoiceSchema.index({ invoiceId: 1 });

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
