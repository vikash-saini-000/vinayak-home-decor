import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

gallerySchema.index({ category: 1 });
gallerySchema.index({ order: 1 });

export default mongoose.model('Gallery', gallerySchema);
