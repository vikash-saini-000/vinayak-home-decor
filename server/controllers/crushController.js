const Crush = require('../models/Crush');
const User = require('../models/User');
const { checkAndCreateMatch } = require('../services/matchService');

const addCrush = async (req, res) => {
  try {
    const { userId } = req.body;
    const fromUserId = req.user._id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    if (userId === fromUserId.toString()) {
      return res.status(400).json({ message: 'You cannot add yourself as a crush.' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (targetUser.isDisabled) {
      return res.status(400).json({ message: 'This user is not available.' });
    }

    if (req.user.blockedUsers?.includes(userId)) {
      return res.status(400).json({ message: 'You have blocked this user.' });
    }

    const blockedByTarget = await User.findOne({
      _id: userId,
      blockedUsers: fromUserId,
    });
    if (blockedByTarget) {
      return res.status(400).json({ message: 'Unable to add this crush.' });
    }

    const existingCrush = await Crush.findOne({
      fromUser: fromUserId,
      toUser: userId,
    });
    if (existingCrush) {
      return res.status(409).json({ message: 'You already added this person.' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const crushesToday = await Crush.countDocuments({
      fromUser: fromUserId,
      createdAt: { $gte: today },
    });
    if (crushesToday >= 10) {
      return res.status(429).json({ message: 'Daily crush limit reached (10/day).' });
    }

    const crush = await Crush.create({
      fromUser: fromUserId,
      toUser: userId,
    });

    await User.findByIdAndUpdate(fromUserId, { $inc: { crushesCount: 1 } });

    const match = await checkAndCreateMatch(fromUserId, userId);

    res.status(201).json({
      message: match ? 'Crush added! You have a new pending match! 👀' : 'Crush added secretly! 🤫',
      crush: { id: crush._id, status: crush.status },
      hasMatch: !!match,
    });
  } catch (error) {
    if (error.message === 'You cannot add yourself as a crush.') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to add crush.' });
  }
};

const removeCrush = async (req, res) => {
  try {
    const { userId } = req.body;
    const fromUserId = req.user._id;

    const crush = await Crush.findOneAndDelete({
      fromUser: fromUserId,
      toUser: userId,
      status: 'pending',
    });

    if (!crush) {
      return res.status(404).json({ message: 'Crush not found or already matched.' });
    }

    await User.findByIdAndUpdate(fromUserId, { $inc: { crushesCount: -1 } });

    res.json({ message: 'Crush removed.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove crush.' });
  }
};

const getMyCrushes = async (req, res) => {
  try {
    const crushes = await Crush.find({ fromUser: req.user._id })
      .populate('toUser', 'name email avatar branch year')
      .sort({ createdAt: -1 });

    res.json(crushes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get crushes.' });
  }
};

module.exports = { addCrush, removeCrush, getMyCrushes };
