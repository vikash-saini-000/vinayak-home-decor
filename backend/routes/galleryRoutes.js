import { Router } from 'express';
import {
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from '../controllers/galleryController.js';
import protect from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = Router();

router.get('/', getGalleryImages);
router.post('/', protect, upload.single('image'), createGalleryImage);
router.put('/:id', protect, upload.single('image'), updateGalleryImage);
router.delete('/:id', protect, deleteGalleryImage);

export default router;
