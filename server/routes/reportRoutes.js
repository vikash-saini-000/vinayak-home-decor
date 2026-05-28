const express = require('express');
const { createReport } = require('../controllers/reportController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', verifyToken, createReport);

module.exports = router;
