const Crush = require('../models/Crush');
const Match = require('../models/Match');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendMutualCrushEmail } = require('./emailService');

const checkAndCreateMatch = async (fromUserId, toUserId) => {
  const reverseCrush = await Crush.findOne({
    fromUser: toUserId,
    toUser: fromUserId,
    status: 'pending',
  });

  if (!reverseCrush) return null;

  const existingMatch = await Match.findOne({
    users: { $all: [fromUserId, toUserId] },
    status: { $ne: 'declined' },
  });

  if (existingMatch) return existingMatch;

  reverseCrush.status = 'matched';
  await reverseCrush.save();

  await Crush.findOneAndUpdate(
    { fromUser: fromUserId, toUser: toUserId },
    { status: 'matched' }
  );

  const match = await Match.create({
    users: [fromUserId, toUserId],
    confirmedBy: [],
    declinedBy: [],
    revealed: false,
    status: 'pending',
  });

  await User.findByIdAndUpdate(fromUserId, { $inc: { matchesCount: 1 } });
  await User.findByIdAndUpdate(toUserId, { $inc: { matchesCount: 1 } });

  await Notification.create([
    {
      user: fromUserId,
      type: 'mutual_crush',
      message: 'Someone you added also added you! 👀 Check your pending matches.',
      matchId: match._id,
    },
    {
      user: toUserId,
      type: 'mutual_crush',
      message: 'Someone you added also added you! 👀 Check your pending matches.',
      matchId: match._id,
    },
  ]);

  const [fromUser, toUser] = await Promise.all([
    User.findById(fromUserId),
    User.findById(toUserId),
  ]);

  await Promise.all([
    sendMutualCrushEmail(fromUser),
    sendMutualCrushEmail(toUser),
  ]);

  return match;
};

module.exports = { checkAndCreateMatch };
