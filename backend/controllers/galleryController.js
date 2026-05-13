import Gallery from '../models/Gallery.js';
import { cloudinary } from '../config/cloudinary.js';

export const getGalleryImages = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;

    const images = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const { title, category, order } = req.body;
    const galleryImage = await Gallery.create({
      title: title || '',
      category: category || 'General',
      image: { url: req.file.path, publicId: req.file.filename },
      order: order ? Number(order) : 0,
    });

    res.status(201).json(galleryImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateGalleryImage = async (req, res) => {
  try {
    const galleryImage = await Gallery.findById(req.params.id);
    if (!galleryImage) {
      return res.status(404).json({ message: 'Gallery image not found' });
    }

    const { title, category, order } = req.body;
    if (title !== undefined) galleryImage.title = title;
    if (category !== undefined) galleryImage.category = category;
    if (order !== undefined) galleryImage.order = Number(order);

    if (req.file) {
      await cloudinary.uploader.destroy(galleryImage.image.publicId);
      galleryImage.image = { url: req.file.path, publicId: req.file.filename };
    }

    const updated = await galleryImage.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGalleryImage = async (req, res) => {
  try {
    const galleryImage = await Gallery.findById(req.params.id);
    if (!galleryImage) {
      return res.status(404).json({ message: 'Gallery image not found' });
    }

    await cloudinary.uploader.destroy(galleryImage.image.publicId);
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
