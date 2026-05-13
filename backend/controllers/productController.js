import Product from '../models/Product.js';
import { deleteFile } from '../config/upload.js';

export const getProducts = async (req, res) => {
  try {
    const { category, featured, search, limit = 50, page = 1 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, category, price, featured, material, dimensions } = req.body;
    const images = req.files
      ? req.files.map((file) => ({
          url: `/uploads/${file.filename}`,
          publicId: file.filename,
        }))
      : [];

    const product = await Product.create({
      title,
      description,
      category,
      price: Number(price),
      images,
      material: material || '',
      dimensions: dimensions || '',
      featured: featured === 'true',
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { title, description, category, price, featured, existingImages, material, dimensions } = req.body;

    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.price = price ? Number(price) : product.price;
    product.featured = featured !== undefined ? featured === 'true' : product.featured;
    if (material !== undefined) product.material = material;
    if (dimensions !== undefined) product.dimensions = dimensions;

    if (existingImages) {
      const kept = JSON.parse(existingImages);
      const removed = product.images.filter(
        (img) => !kept.find((k) => k.publicId === img.publicId)
      );
      for (const img of removed) {
        deleteFile(img.url);
      }
      product.images = kept;
    }

    if (req.files?.length) {
      const newImages = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        publicId: file.filename,
      }));
      product.images = [...product.images, ...newImages];
    }

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.featured = !product.featured;
    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    for (const img of product.images) {
      deleteFile(img.url);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
