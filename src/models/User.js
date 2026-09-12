import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: { type: String }, // Optional for OAuth users
  image: { type: String },
  role: { type: String, default: 'Merchant' },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  country: { type: String, default: 'Bangladesh' },
  postalCode: { type: String },
  storeName: { type: String, default: 'My F-Commerce Shop' },
  steadfastApiKey: { type: String },
  steadfastSecretKey: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
