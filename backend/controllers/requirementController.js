const mongoose = require('mongoose');
const Requirement = require('../models/Requirement');
const Organization = require('../models/Organization');
const memoryStore = require('../utils/memoryStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.createRequirement = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      let org = await Organization.findOne({ user: req.user.id });
      const requirementData = {
        ...req.body,
        organization: org ? org._id : req.body.organization,
        size: Array.isArray(req.body.size) ? req.body.size : [req.body.size || 'M']
      };
      const requirement = await Requirement.create(requirementData);
      return res.status(201).json({ success: true, message: 'Clothing requirement created.', data: requirement });
    }

    const newReq = {
      _id: `req_${Date.now()}`,
      organization: memoryStore.organizations[0]._id,
      quantityFulfilled: 0,
      status: 'Active',
      ...req.body,
      size: Array.isArray(req.body.size) ? req.body.size : [req.body.size || 'M']
    };
    memoryStore.requirements.unshift(newReq);
    res.status(201).json({ success: true, message: 'Clothing requirement created.', data: newReq });
  } catch (error) {
    next(error);
  }
};

exports.getRequirements = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const requirements = await Requirement.find({ status: { $in: ['Active', 'Partially Fulfilled'] } })
        .populate('organization', 'organizationName organizationType location contactPerson verificationStatus')
        .sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: requirements.length, data: requirements });
    }

    const list = memoryStore.requirements.map(r => {
      const org = memoryStore.organizations.find(o => o._id === r.organization) || memoryStore.organizations[0];
      return { ...r, organization: org };
    });
    res.status(200).json({ success: true, count: list.length, data: list });
  } catch (error) {
    next(error);
  }
};

exports.getRequirementById = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const requirement = await Requirement.findById(req.params.id).populate('organization');
      if (!requirement) return res.status(404).json({ success: false, message: 'Requirement not found.' });
      return res.status(200).json({ success: true, data: requirement });
    }

    const reqItem = memoryStore.requirements.find(r => r._id === req.params.id) || memoryStore.requirements[0];
    res.status(200).json({ success: true, data: reqItem });
  } catch (error) {
    next(error);
  }
};

exports.updateRequirement = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      let requirement = await Requirement.findById(req.params.id);
      if (!requirement) return res.status(404).json({ success: false, message: 'Requirement not found.' });
      requirement = await Requirement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      return res.status(200).json({ success: true, message: 'Requirement updated.', data: requirement });
    }

    let index = memoryStore.requirements.findIndex(r => r._id === req.params.id);
    if (index !== -1) {
      memoryStore.requirements[index] = { ...memoryStore.requirements[index], ...req.body };
    }
    res.status(200).json({ success: true, message: 'Requirement updated.', data: memoryStore.requirements[0] });
  } catch (error) {
    next(error);
  }
};

exports.deleteRequirement = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const requirement = await Requirement.findById(req.params.id);
      if (!requirement) return res.status(404).json({ success: false, message: 'Requirement not found.' });
      await requirement.deleteOne();
      return res.status(200).json({ success: true, message: 'Requirement deleted.' });
    }

    memoryStore.requirements = memoryStore.requirements.filter(r => r._id !== req.params.id);
    res.status(200).json({ success: true, message: 'Requirement deleted.' });
  } catch (error) {
    next(error);
  }
};

exports.getMyRequirements = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const org = await Organization.findOne({ user: req.user.id });
      if (!org) return res.status(404).json({ success: false, message: 'Organization profile not found.' });
      const requirements = await Requirement.find({ organization: org._id }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: requirements.length, data: requirements });
    }

    const list = memoryStore.requirements.map(r => {
      const org = memoryStore.organizations.find(o => o._id === r.organization) || memoryStore.organizations[0];
      return { ...r, organization: org };
    });
    res.status(200).json({ success: true, count: list.length, data: list });
  } catch (error) {
    next(error);
  }
};
