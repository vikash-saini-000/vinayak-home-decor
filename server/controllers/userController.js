const User = require('../models/User');
const validator = require('validator');

const updateProfile = async (req, res) => {
  try {
    const { branch, year, bio } = req.body;
    const updates = {};

    if (branch !== undefined) updates.branch = validator.escape(branch.trim());
    if (year !== undefined) updates.year = year;
    if (bio !== undefined) {
      if (bio.length > 200) {
        return res.status(400).json({ message: 'Bio must be under 200 characters.' });
      }
      updates.bio = validator.escape(bio.trim());
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-__v -blockedUsers');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile.' });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { q, branch, year, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {
      _id: { $ne: req.user._id },
      isDisabled: { $ne: true },
    };

    if (req.user.blockedUsers?.length > 0) {
      filter._id = { $ne: req.user._id, $nin: req.user.blockedUsers };
    }

    if (q) {
      const sanitized = validator.escape(q.trim());
      filter.$or = [
        { name: { $regex: sanitized, $options: 'i' } },
        { email: { $regex: sanitized, $options: 'i' } },
      ];
    }

    if (branch) filter.branch = { $regex: validator.escape(branch.trim()), $options: 'i' };
    if (year) filter.year = year;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('name email avatar branch year')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ name: 1 }),
      User.countDocuments(filter),
    ]);

    res.json({
      users,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: 'Search failed.' });
  }
};

const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot block yourself.' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { blockedUsers: userId },
    });

    res.json({ message: 'User blocked.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to block user.' });
  }
};

const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { blockedUsers: userId },
    });

    res.json({ message: 'User unblocked.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to unblock user.' });
  }
};

module.exports = { updateProfile, searchUsers, blockUser, unblockUser };
