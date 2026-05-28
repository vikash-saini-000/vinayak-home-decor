const express = require('express');
const { updateProfile, searchUsers, blockUser, unblockUser } = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');
const { searchLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.put('/update', verifyToken, updateProfile);
router.get('/search', verifyToken, searchLimiter, searchUsers);
router.post('/block/:userId', verifyToken, blockUser);
router.post('/unblock/:userId', verifyToken, unblockUser);

module.exports = router;
