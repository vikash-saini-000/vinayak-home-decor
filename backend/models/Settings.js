import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, default: 'Vinayak' },
    heroSubtitle: { type: String, default: 'Home Decor' },
    heroTagline: { type: String, default: 'Premium Furniture' },
    heroDescription: {
      type: String,
      default: 'Where craftsmanship meets luxury. Discover furniture that transforms spaces into stories of elegance.',
    },
    aboutTitle: { type: String, default: 'Crafting Elegance Since 2009' },
    aboutDescription: {
      type: String,
      default: 'At Vinayak Home Decor, we believe furniture is more than function — it\'s an expression of who you are.',
    },
    whatsappNumber: { type: String, default: '919876543210' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Settings', settingsSchema);
