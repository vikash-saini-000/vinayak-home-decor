import { Router } from 'express';
import { login, getProfile } from '../controllers/authController.js';
import protect from '../middleware/auth.js';
import { validateLogin } from '../middleware/validate.js';

const router = Router();

router.post('/login', validateLogin, login);
router.get('/profile', protect, getProfile);

export default router;
