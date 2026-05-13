import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    phone: { type: String, default: '+91 98765 43210' },
    whatsapp: { type: String, default: '+91 98765 43210' },
    email: { type: String, default: 'info@vinayakhomedecor.com' },
    address: { type: String, default: 'Vinayak Home Decor, Main Market, India' },
    mapUrl: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    youtube: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Contact', contactSchema);
