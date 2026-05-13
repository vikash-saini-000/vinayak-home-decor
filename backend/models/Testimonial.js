import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role/title is required'],
      trim: true,
    },
    text: {
      type: String,
      required: [true, 'Testimonial text is required'],
      maxlength: [1000, 'Text cannot exceed 1000 characters'],
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Testimonial', testimonialSchema);
