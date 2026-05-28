const Report = require('../models/Report');
const User = require('../models/User');
const validator = require('validator');

const createReport = async (req, res) => {
  try {
    const { userId, reason, description } = req.body;

    if (!userId || !reason) {
      return res.status(400).json({ message: 'User ID and reason are required.' });
    }

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot report yourself.' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const existingReport = await Report.findOne({
      reportedBy: req.user._id,
      reportedUser: userId,
      status: 'pending',
    });
    if (existingReport) {
      return res.status(409).json({ message: 'You already reported this user.' });
    }

    const report = await Report.create({
      reportedBy: req.user._id,
      reportedUser: userId,
      reason,
      description: description ? validator.escape(description.trim()) : '',
    });

    res.status(201).json({ message: 'Report submitted.', report });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit report.' });
  }
};

module.exports = { createReport };
