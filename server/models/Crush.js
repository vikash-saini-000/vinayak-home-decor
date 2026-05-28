const mongoose = require('mongoose');

const crushSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'matched', 'declined'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

crushSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });
crushSchema.index({ toUser: 1, fromUser: 1 });
crushSchema.index({ fromUser: 1, status: 1 });

crushSchema.pre('validate', function (next) {
  if (this.fromUser.toString() === this.toUser.toString()) {
    return next(new Error('You cannot add yourself as a crush.'));
  }
  next();
});

module.exports = mongoose.model('Crush', crushSchema);
