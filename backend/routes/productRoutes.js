import { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  toggleFeatured,
  deleteProduct,
} from '../controllers/productController.js';
import protect from '../middleware/auth.js';
import upload from '../config/upload.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, upload.array('images', 10), createProduct);
router.put('/:id', protect, upload.array('images', 10), updateProduct);
router.put('/:id/featured', protect, toggleFeatured);
router.delete('/:id', protect, deleteProduct);

export default router;
