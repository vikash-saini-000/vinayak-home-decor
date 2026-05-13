import Testimonial from '../models/Testimonial.js';
import { deleteFile } from '../config/upload.js';

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const { name, role, text, rating } = req.body;
    const image = req.file
      ? { url: `/uploads/${req.file.filename}`, publicId: req.file.filename }
      : { url: '', publicId: '' };

    const testimonial = await Testimonial.create({
      name,
      role,
      text,
      rating: Number(rating) || 5,
      image,
    });

    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    const { name, role, text, rating } = req.body;
    testimonial.name = name || testimonial.name;
    testimonial.role = role || testimonial.role;
    testimonial.text = text || testimonial.text;
    testimonial.rating = rating ? Number(rating) : testimonial.rating;

    if (req.file) {
      if (testimonial.image.publicId) {
        deleteFile(testimonial.image.url);
      }
      testimonial.image = {
        url: `/uploads/${req.file.filename}`,
        publicId: req.file.filename,
      };
    }

    const updated = await testimonial.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    if (testimonial.image.publicId) {
      deleteFile(testimonial.image.url);
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
