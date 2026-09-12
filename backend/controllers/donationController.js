const mongoose = require('mongoose');
const Donation = require('../models/Donation');
const memoryStore = require('../utils/memoryStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Create a new clothing donation
// @route   POST /api/donations
// @access  Private (Donor, Admin)
exports.createDonation = async (req, res, next) => {
  try {
    const donationData = {
      ...req.body,
      donor: req.user ? req.user.id || req.user._id : 'usr_donor_101',
      pickupLocation: req.body.pickupLocation || (req.user ? req.user.location : {})
    };

    if (isDbConnected()) {
      const donation = await Donation.create(donationData);
      return res.status(201).json({
        success: true,
        message: 'Clothing donation created successfully.',
        data: donation
      });
    }

    // Memory Fallback
    const fallbackDonation = {
      _id: `don_${Date.now()}`,
      ...donationData,
      status: donationData.status || 'Available',
      createdAt: donationData.createdAt || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };
    memoryStore.donations.unshift(fallbackDonation);

    res.status(201).json({
      success: true,
      message: 'Clothing donation created successfully (In-Memory).',
      data: fallbackDonation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations with search and filters
// @route   GET /api/donations or GET /api/search/donations
// @access  Public
exports.getDonations = async (req, res, next) => {
  try {
    const { clothingType, size, genderSuitability, ageGroup, condition, city, status, page = 1, limit = 10 } = req.query;

    if (isDbConnected()) {
      let query = {};
      if (clothingType && clothingType !== 'All') query.clothingType = clothingType;
      if (size && size !== 'All') query.size = size;
      if (genderSuitability && genderSuitability !== 'All') query.genderSuitability = genderSuitability;
      if (ageGroup && ageGroup !== 'All') query.ageGroup = ageGroup;
      if (condition && condition !== 'All') query.condition = condition;
      if (status && status !== 'All') query.status = status;
      if (city) query['pickupLocation.city'] = new RegExp(city, 'i');

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      const total = await Donation.countDocuments(query);
      const donations = await Donation.find(query)
        .populate('donor', 'name email phone profileImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      return res.status(200).json({
        success: true,
        count: donations.length,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        results: donations,
        data: donations
      });
    }

    // Memory Fallback
    let list = [...memoryStore.donations];
    if (clothingType && clothingType !== 'All') list = list.filter(d => d.clothingType === clothingType);
    if (size && size !== 'All') list = list.filter(d => d.size === size);
    if (genderSuitability && genderSuitability !== 'All') list = list.filter(d => d.genderSuitability === genderSuitability);
    if (condition && condition !== 'All') list = list.filter(d => d.condition === condition);

    res.status(200).json({
      success: true,
      count: list.length,
      total: list.length,
      page: 1,
      totalPages: 1,
      results: list,
      data: list
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single donation details
// @route   GET /api/donations/:id
// @access  Public
exports.getDonationById = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const donation = await Donation.findById(req.params.id).populate('donor', 'name email phone profileImage location');
      if (!donation) {
        return res.status(404).json({ success: false, message: 'Donation not found.' });
      }
      return res.status(200).json({ success: true, data: donation });
    }

    const donation = memoryStore.donations.find(d => d._id === req.params.id || d.id === req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found.' });
    }

    res.status(200).json({ success: true, data: donation });
  } catch (error) {
    next(error);
  }
};

// @desc    Update donation
// @route   PUT /api/donations/:id
// @access  Private
exports.updateDonation = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      let donation = await Donation.findById(req.params.id);
      if (!donation) {
        return res.status(404).json({ success: false, message: 'Donation not found.' });
      }
      donation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      return res.status(200).json({ success: true, message: 'Donation updated successfully.', data: donation });
    }

    let index = memoryStore.donations.findIndex(d => d._id === req.params.id || d.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Donation not found.' });
    }

    memoryStore.donations[index] = { ...memoryStore.donations[index], ...req.body };
    res.status(200).json({ success: true, message: 'Donation updated successfully.', data: memoryStore.donations[index] });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete donation
// @route   DELETE /api/donations/:id
// @access  Private
exports.deleteDonation = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const donation = await Donation.findById(req.params.id);
      if (!donation) {
        return res.status(404).json({ success: false, message: 'Donation not found.' });
      }
      await donation.deleteOne();
      return res.status(200).json({ success: true, message: 'Donation deleted successfully.' });
    }

    memoryStore.donations = memoryStore.donations.filter(d => d._id !== req.params.id && d.id !== req.params.id);
    res.status(200).json({ success: true, message: 'Donation deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in donor's donations
// @route   GET /api/donations/my-donations
// @access  Private
exports.getMyDonations = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const donations = await Donation.find({ donor: req.user.id }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: donations.length, data: donations });
    }

    const userId = req.user ? req.user.id || req.user._id : 'usr_donor_101';
    const list = memoryStore.donations.filter(d => d.donor === userId || d.donor === 'usr_donor_101');
    res.status(200).json({ success: true, count: list.length, data: list });
  } catch (error) {
    next(error);
  }
};
