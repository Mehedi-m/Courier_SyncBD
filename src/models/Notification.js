import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Orders', 'Schedule', 'System', 'Invoices'], 
    default: 'Orders' 
  },
  type: { 
    type: String, 
    enum: ['order', 'schedule', 'user', 'payment', 'security', 'dispatch'], 
    default: 'order' 
  },
  isRead: { type: Boolean, default: false },
  link: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
