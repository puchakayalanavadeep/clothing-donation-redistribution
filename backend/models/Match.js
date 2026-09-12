const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: true,
    index: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true
  },
  requirement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Requirement',
    required: true,
    index: true
  },
  matchScore: {
    type: Number,
    required: true
  },
  reasoning: {
    type: String,
    required: true
  },
  compatibilityScores: {
    clothingType: { type: Number, default: 0 },
    size: { type: Number, default: 0 },
    genderAge: { type: Number, default: 0 },
    condition: { type: Number, default: 0 },
    demand: { type: Number, default: 0 },
    location: { type: Number, default: 0 },
    urgency: { type: Number, default: 0 }
  },
  distance: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Recommended', 'Accepted', 'Rejected', 'Collected', 'Delivered'],
    default: 'Recommended',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Match', matchSchema);
