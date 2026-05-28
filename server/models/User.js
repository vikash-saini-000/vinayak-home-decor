const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    branch: {
      type: String,
      default: '',
      trim: true,
    },
    year: {
      type: String,
      enum: ['', '1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Alumni'],
      default: '',
    },
    bio: {
      type: String,
      maxlength: 200,
      default: '',
    },
    crushesCount: {
      type: Number,
      default: 0,
    },
    matchesCount: {
      type: Number,
      default: 0,
    },
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ name: 'text', email: 'text', branch: 'text' });

module.exports = mongoose.model('User', userSchema);
