const { generateToken, setTokenCookie } = require('../utils/generateToken');
const { sendWelcomeEmail } = require('../services/emailService');
const User = require('../models/User');

const googleCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }

    const token = generateToken(req.user._id);
    setTokenCookie(res, token);

    const isNew = (Date.now() - new Date(req.user.createdAt).getTime()) < 10000;
    if (isNew) {
      await sendWelcomeEmail(req.user);
    }

    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
  }
};

const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: new Date(0),
  });
  res.json({ message: 'Logged out successfully.' });
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v -blockedUsers');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user data.' });
  }
};

module.exports = { googleCallback, logout, getMe };
