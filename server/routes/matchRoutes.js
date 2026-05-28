const express = require('express');
const { getMatches, confirmMatch, declineMatch } = require('../controllers/matchController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, getMatches);
router.post('/:matchId/confirm', verifyToken, confirmMatch);
router.post('/:matchId/decline', verifyToken, declineMatch);

module.exports = router;
