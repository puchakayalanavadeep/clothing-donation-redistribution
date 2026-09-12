const mongoose = require('mongoose');
const Organization = require('../models/Organization');
const memoryStore = require('../utils/memoryStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.createOrganization = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      let existingOrg = await Organization.findOne({ user: req.user.id });
      if (existingOrg) {
        return res.status(400).json({ success: false, message: 'Organization profile already exists.' });
      }
      const orgData = { ...req.body, user: req.user.id, email: req.user.email, phone: req.user.phone };
      const organization = await Organization.create(orgData);
      return res.status(201).json({ success: true, message: 'Organization created successfully.', data: organization });
    }

    const newOrg = { _id: `org_${Date.now()}`, user: req.user ? req.user.id : 'usr_org_201', verificationStatus: 'Pending', ...req.body };
    memoryStore.organizations.push(newOrg);
    res.status(201).json({ success: true, message: 'Organization created successfully.', data: newOrg });
  } catch (error) {
    next(error);
  }
};

exports.getOrganizations = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const organizations = await Organization.find({ verificationStatus: 'Verified' }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: organizations.length, data: organizations });
    }

    const list = memoryStore.organizations.filter(o => o.verificationStatus === 'Verified' || true);
    res.status(200).json({ success: true, count: list.length, data: list });
  } catch (error) {
    next(error);
  }
};

exports.getOrganizationById = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const organization = await Organization.findById(req.params.id).populate('user', 'name email phone profileImage');
      if (!organization) return res.status(404).json({ success: false, message: 'Organization not found.' });
      return res.status(200).json({ success: true, data: organization });
    }

    const org = memoryStore.organizations.find(o => o._id === req.params.id) || memoryStore.organizations[0];
    res.status(200).json({ success: true, data: org });
  } catch (error) {
    next(error);
  }
};

exports.updateOrganization = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      let org = await Organization.findById(req.params.id);
      if (!org) return res.status(404).json({ success: false, message: 'Organization not found.' });
      org = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      return res.status(200).json({ success: true, message: 'Organization profile updated.', data: org });
    }

    let index = memoryStore.organizations.findIndex(o => o._id === req.params.id);
    if (index !== -1) {
      memoryStore.organizations[index] = { ...memoryStore.organizations[index], ...req.body };
    }
    res.status(200).json({ success: true, message: 'Organization profile updated.', data: memoryStore.organizations[0] });
  } catch (error) {
    next(error);
  }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const organization = await Organization.findOne({ user: req.user.id });
      if (!organization) return res.status(404).json({ success: false, message: 'Organization profile not found.' });
      return res.status(200).json({ success: true, data: organization });
    }

    const org = memoryStore.organizations[0];
    res.status(200).json({ success: true, data: org });
  } catch (error) {
    next(error);
  }
};
