import { Router } from 'express';
import {
  createInquiry,
  getInquiries,
  markAsRead,
  updateInquiryStatus,
  deleteInquiry,
} from '../controllers/inquiryController.js';
import protect from '../middleware/auth.js';

const router = Router();

router.post('/', createInquiry);
router.get('/', protect, getInquiries);
router.put('/:id/read', protect, markAsRead);
router.put('/:id/status', protect, updateInquiryStatus);
router.delete('/:id', protect, deleteInquiry);

export default router;
