const express = require('express');
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, getNotifications);
router.put('/:notificationId/read', verifyToken, markAsRead);
router.put('/read-all', verifyToken, markAllAsRead);

module.exports = router;
