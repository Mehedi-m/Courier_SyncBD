import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, default: '' },
  deliveryAddress: { type: String, required: true },
  district: { type: String, default: 'Dhaka' },
  codAmount: { type: Number, required: true },
  items: { type: String, default: 'Online Order Parcel' },
  courierName: { type: String, enum: ['Steadfast', 'Pathao', 'RedX', 'None'], default: 'Steadfast' },
  courierTrackingCode: { type: String, default: null },
  status: { type: String, enum: ['Pending', 'Booked', 'Delivered', 'Cancelled'], default: 'Pending' },
  invoiceId: { type: String, default: null },
  invoiceSent: { type: Boolean, default: false },
  invoiceSentAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ district: 1 });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);