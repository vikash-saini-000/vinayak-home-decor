const Match = require('../models/Match');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendMatchRevealedEmail } = require('../services/emailService');

const getMatches = async (req, res) => {
  try {
    const userId = req.user._id;

    const matches = await Match.find({
      users: userId,
      status: { $ne: 'declined' },
    }).sort({ updatedAt: -1 });

    const result = await Promise.all(
      matches.map(async (match) => {
        const otherUserId = match.users.find(
          (id) => id.toString() !== userId.toString()
        );

        const isRevealed = match.revealed && match.status === 'revealed';
        const userConfirmed = match.confirmedBy.some(
          (id) => id.toString() === userId.toString()
        );
        const userDeclined = match.declinedBy.some(
          (id) => id.toString() === userId.toString()
        );

        let otherUser = null;
        if (isRevealed) {
          otherUser = await User.findById(otherUserId).select('name email avatar branch year');
        }

        return {
          _id: match._id,
          status: match.status,
          revealed: match.revealed,
          userConfirmed,
          userDeclined,
          otherUser,
          createdAt: match.createdAt,
          updatedAt: match.updatedAt,
        };
      })
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get matches.' });
  }
};

const confirmMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user._id;

    const match = await Match.findOne({
      _id: matchId,
      users: userId,
      status: 'pending',
    });

    if (!match) {
      return res.status(404).json({ message: 'Match not found or already resolved.' });
    }

    if (match.confirmedBy.some((id) => id.toString() === userId.toString())) {
      return res.status(400).json({ message: 'You already confirmed this match.' });
    }

    match.confirmedBy.push(userId);

    if (match.confirmedBy.length === 2) {
      match.revealed = true;
      match.status = 'revealed';

      const [user1, user2] = await Promise.all(
        match.users.map((id) => User.findById(id))
      );

      await Promise.all([
        sendMatchRevealedEmail(user1, user2.name),
        sendMatchRevealedEmail(user2, user1.name),
      ]);

      await Notification.create([
        {
          user: match.users[0],
          type: 'match_revealed',
          message: `It's a match! You and ${user2.name} have mutual feelings! 🎉`,
          matchId: match._id,
        },
        {
          user: match.users[1],
          type: 'match_revealed',
          message: `It's a match! You and ${user1.name} have mutual feelings! 🎉`,
          matchId: match._id,
        },
      ]);
    }

    await match.save();

    res.json({
      message: match.revealed
        ? "It's a match! Identities revealed! 🎉"
        : 'Waiting for the other person to confirm... 🤞',
      revealed: match.revealed,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to confirm match.' });
  }
};

const declineMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user._id;

    const match = await Match.findOne({
      _id: matchId,
      users: userId,
      status: 'pending',
    });

    if (!match) {
      return res.status(404).json({ message: 'Match not found or already resolved.' });
    }

    match.declinedBy.push(userId);
    match.status = 'declined';
    await match.save();

    const otherUserId = match.users.find(
      (id) => id.toString() !== userId.toString()
    );

    await Notification.create({
      user: otherUserId,
      type: 'match_declined',
      message: 'A pending match has been declined.',
      matchId: match._id,
    });

    res.json({ message: 'Match declined.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to decline match.' });
  }
};

module.exports = { getMatches, confirmMatch, declineMatch };
