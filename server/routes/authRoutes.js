const express = require('express');
const passport = require('passport');
const { googleCallback, logout, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get(
  '/google',
  authLimiter,
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=domain_not_allowed`,
    session: false,
  }),
  googleCallback
);

router.post('/logout', verifyToken, logout);
router.get('/me', verifyToken, getMe);

module.exports = router;
