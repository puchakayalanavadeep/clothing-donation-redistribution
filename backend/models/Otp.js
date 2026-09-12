const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['login', 'register', 'reset_password'],
    default: 'login'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // Auto-delete document after 5 minutes (300s)
  }
});

module.exports = mongoose.model('Otp', otpSchema);
