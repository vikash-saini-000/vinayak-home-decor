const express = require('express');
const { getStats, getUsers, disableUser, enableUser, getReports, updateReport } = require('../controllers/adminController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken, requireAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.post('/users/:userId/disable', disableUser);
router.post('/users/:userId/enable', enableUser);
router.get('/reports', getReports);
router.put('/reports/:reportId', updateReport);

module.exports = router;
