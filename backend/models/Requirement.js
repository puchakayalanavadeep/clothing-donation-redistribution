const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true
  },
  clothingType: {
    type: String,
    required: true,
    index: true
  },
  size: [{
    type: String,
    required: true
  }],
  genderSuitability: {
    type: String,
    required: true
  },
  ageGroup: {
    type: String,
    required: true
  },
  quantityRequired: {
    type: Number,
    required: true
  },
  quantityFulfilled: {
    type: Number,
    default: 0
  },
  urgencyLevel: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Partially Fulfilled', 'Fulfilled'],
    default: 'Active',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Requirement', requirementSchema);
