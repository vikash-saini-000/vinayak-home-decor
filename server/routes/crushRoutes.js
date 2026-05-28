const express = require('express');
const { addCrush, removeCrush, getMyCrushes } = require('../controllers/crushController');
const { verifyToken } = require('../middleware/auth');
const { crushLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/add', verifyToken, crushLimiter, addCrush);
router.delete('/remove', verifyToken, removeCrush);
router.get('/my', verifyToken, getMyCrushes);

module.exports = router;
