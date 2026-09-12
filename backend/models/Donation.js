const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  clothingName: {
    type: String,
    required: [true, 'Clothing name is required'],
    trim: true
  },
  clothingType: {
    type: String,
    required: true,
    enum: ['Shirt', 'T-Shirt', 'Pants', 'Jeans', 'Dress', 'Jacket', 'Sweater', 'Shoes', 'Other'],
    index: true
  },
  genderSuitability: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Unisex']
  },
  ageGroup: {
    type: String,
    required: true,
    enum: ['Child', 'Teen', 'Adult', 'Senior']
  },
  size: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true,
    enum: ['Excellent', 'Good', 'Fair']
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  description: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  pickupLocation: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, default: 12.9716 },
      longitude: { type: Number, default: 77.5946 }
    }
  },
  preferredPickupDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Available', 'Matching', 'Matched', 'Collected', 'Delivered', 'Cancelled'],
    default: 'Available',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Donation', donationSchema);
