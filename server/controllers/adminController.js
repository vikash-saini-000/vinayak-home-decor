const User = require('../models/User');
const Report = require('../models/Report');
const Match = require('../models/Match');
const Crush = require('../models/Crush');

const getStats = async (req, res) => {
  try {
    const [totalUsers, totalCrushes, totalMatches, totalReports, pendingReports] =
      await Promise.all([
        User.countDocuments(),
        Crush.countDocuments(),
        Match.countDocuments(),
        Report.countDocuments(),
        Report.countDocuments({ status: 'pending' }),
      ]);

    res.json({ totalUsers, totalCrushes, totalMatches, totalReports, pendingReports });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get stats.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, q } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-__v')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    res.json({ users, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get users.' });
  }
};

const disableUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { isDisabled: true }, { new: true });

    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json({ message: 'User disabled.', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to disable user.' });
  }
};

const enableUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { isDisabled: false }, { new: true });

    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json({ message: 'User enabled.', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to enable user.' });
  }
};

const getReports = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;

    const [reports, total] = await Promise.all([
      Report.find(filter)
        .populate('reportedBy', 'name email')
        .populate('reportedUser', 'name email')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Report.countDocuments(filter),
    ]);

    res.json({ reports, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get reports.' });
  }
};

const updateReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, adminNote } = req.body;

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status, adminNote },
      { new: true }
    ).populate('reportedBy', 'name email').populate('reportedUser', 'name email');

    if (!report) return res.status(404).json({ message: 'Report not found.' });

    res.json({ message: 'Report updated.', report });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update report.' });
  }
};

module.exports = { getStats, getUsers, disableUser, enableUser, getReports, updateReport };
