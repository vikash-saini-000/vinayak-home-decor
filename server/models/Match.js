const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    confirmedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    declinedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    revealed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'revealed', 'declined'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

matchSchema.index({ users: 1 });
matchSchema.index({ status: 1 });

module.exports = mongoose.model('Match', matchSchema);
