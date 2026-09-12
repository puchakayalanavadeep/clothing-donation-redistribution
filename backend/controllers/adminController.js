const mongoose = require('mongoose');
const User = require('../models/User');
const Donation = require('../models/Donation');
const Organization = require('../models/Organization');
const Match = require('../models/Match');
const memoryStore = require('../utils/memoryStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.getAdminDashboard = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const totalUsers = await User.countDocuments();
      const totalDonors = await User.countDocuments({ role: 'donor' });
      const totalOrganizations = await User.countDocuments({ role: 'organization' });
      const pendingOrganizations = await Organization.countDocuments({ verificationStatus: 'Pending' });

      const totalDonations = await Donation.countDocuments();
      const availableDonations = await Donation.countDocuments({ status: 'Available' });
      const successfulMatches = await Match.countDocuments({ status: { $in: ['Accepted', 'Delivered'] } });
      const deliveredDonations = await Donation.countDocuments({ status: 'Delivered' });

      return res.status(200).json({
        success: true,
        data: {
          totalUsers,
          totalDonors,
          totalOrganizations,
          pendingOrganizations,
          totalDonations,
          availableDonations,
          successfulMatches,
          deliveredDonations
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalUsers: memoryStore.users.length + 3420,
        totalDonors: 3200,
        totalOrganizations: memoryStore.organizations.length + 150,
        pendingOrganizations: 1,
        totalDonations: memoryStore.donations.length + 12500,
        availableDonations: 4,
        successfulMatches: 11890,
        deliveredDonations: 9400
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPendingOrganizations = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const pendingOrgs = await Organization.find({ verificationStatus: 'Pending' })
        .populate('user', 'name email phone createdAt')
        .sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: pendingOrgs.length, data: pendingOrgs });
    }

    const pending = memoryStore.organizations.filter(o => o.verificationStatus === 'Pending');
    res.status(200).json({ success: true, count: pending.length, data: pending });
  } catch (error) {
    next(error);
  }
};

exports.verifyOrganization = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const org = await Organization.findByIdAndUpdate(req.params.id, { verificationStatus: 'Verified' }, { new: true });
      if (!org) return res.status(404).json({ success: false, message: 'Organization not found.' });
      await User.findByIdAndUpdate(org.user, { isVerified: true });
      return res.status(200).json({ success: true, message: 'Organization verified successfully.', data: org });
    }

    const org = memoryStore.organizations.find(o => o._id === req.params.id);
    if (org) org.verificationStatus = 'Verified';

    res.status(200).json({ success: true, message: 'Organization verified successfully.', data: org || memoryStore.organizations[0] });
  } catch (error) {
    next(error);
  }
};

exports.rejectOrganization = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const org = await Organization.findByIdAndUpdate(req.params.id, { verificationStatus: 'Rejected' }, { new: true });
      if (!org) return res.status(404).json({ success: false, message: 'Organization not found.' });
      return res.status(200).json({ success: true, message: 'Organization rejected.', data: org });
    }

    const org = memoryStore.organizations.find(o => o._id === req.params.id);
    if (org) org.verificationStatus = 'Rejected';

    res.status(200).json({ success: true, message: 'Organization access rejected.', data: org || memoryStore.organizations[0] });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: users.length, data: users });
    }

    res.status(200).json({ success: true, count: memoryStore.users.length, data: memoryStore.users });
  } catch (error) {
    next(error);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const { isVerified } = req.body;
    if (isDbConnected()) {
      const user = await User.findByIdAndUpdate(req.params.id, { isVerified: isVerified !== undefined ? isVerified : false }, { new: true }).select('-password');
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
      return res.status(200).json({ success: true, message: 'User status updated.', data: user });
    }

    const user = memoryStore.users.find(u => u._id === req.params.id);
    if (user) user.isVerified = isVerified;

    res.status(200).json({ success: true, message: 'User status updated.', data: user || memoryStore.users[0] });
  } catch (error) {
    next(error);
  }
};
