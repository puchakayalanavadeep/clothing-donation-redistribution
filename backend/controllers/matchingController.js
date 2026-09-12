const mongoose = require('mongoose');
const Match = require('../models/Match');
const Donation = require('../models/Donation');
const Requirement = require('../models/Requirement');
const memoryStore = require('../utils/memoryStore');
const { evaluateMatch } = require('../services/matchingService');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Generate matching recommendations for a donation
// @route   POST /api/matches/:donationId/generate
// @access  Public
exports.generateMatches = async (req, res, next) => {
  try {
    let donation;
    let activeRequirements = [];

    if (isDbConnected()) {
      donation = await Donation.findById(req.params.donationId);
      if (!donation) {
        return res.status(404).json({ success: false, message: 'Donation item not found.' });
      }

      activeRequirements = await Requirement.find({
        status: { $in: ['Active', 'Partially Fulfilled'] }
      }).populate('organization');
    } else {
      donation = memoryStore.donations.find(d => d._id === req.params.donationId || d.id === req.params.donationId) || memoryStore.donations[0];
      activeRequirements = memoryStore.requirements.map(reqItem => {
        const org = memoryStore.organizations.find(o => o._id === reqItem.organization) || memoryStore.organizations[0];
        return { ...reqItem, organization: org };
      });
    }

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation item not found.' });
    }

    const generatedMatches = [];

    for (const reqItem of activeRequirements) {
      const org = reqItem.organization;
      if (!org) continue;

      const evalResult = evaluateMatch(donation, reqItem, org);

      const matchObj = {
        _id: `mth_${Date.now()}_${Math.floor(Math.random()*1000)}`,
        donation: donation._id || donation.id,
        organization: org,
        requirement: reqItem,
        matchScore: evalResult.matchScore,
        reasoning: evalResult.reasoning,
        compatibilityScores: evalResult.compatibilityScores,
        distance: evalResult.distance,
        status: 'Recommended',
        createdAt: new Date().toISOString()
      };

      if (isDbConnected()) {
        await Match.deleteMany({ donation: donation._id, requirement: reqItem._id });
        const savedDoc = await Match.create({
          donation: donation._id,
          organization: org._id,
          requirement: reqItem._id,
          matchScore: evalResult.matchScore,
          reasoning: evalResult.reasoning,
          compatibilityScores: evalResult.compatibilityScores,
          distance: evalResult.distance,
          status: 'Recommended'
        });
        const populated = await Match.findById(savedDoc._id)
          .populate('organization', 'organizationName organizationType location contactPerson verificationStatus phone email')
          .populate('requirement');
        generatedMatches.push(populated);
      } else {
        generatedMatches.push(matchObj);
      }
    }

    generatedMatches.sort((a, b) => b.matchScore - a.matchScore);

    if (isDbConnected() && donation.status === 'Available') {
      donation.status = 'Matching';
      await donation.save();
    } else if (donation.status === 'Available') {
      donation.status = 'Matching';
    }

    res.status(200).json({
      success: true,
      message: 'Matching recommendations generated successfully.',
      count: generatedMatches.length,
      data: generatedMatches
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all match recommendations for a donation
// @route   GET /api/matches/:donationId
// @access  Public
exports.getMatchesForDonation = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const matches = await Match.find({ donation: req.params.donationId })
        .populate('organization', 'organizationName organizationType location contactPerson verificationStatus phone email')
        .populate('requirement')
        .populate('donation')
        .sort({ matchScore: -1 });

      return res.status(200).json({ success: true, count: matches.length, data: matches });
    }

    // Fallback in memory
    const reqMatches = memoryStore.requirements.map(reqItem => {
      const org = memoryStore.organizations.find(o => o._id === reqItem.organization) || memoryStore.organizations[0];
      const donation = memoryStore.donations.find(d => d._id === req.params.donationId) || memoryStore.donations[0];
      const evalResult = evaluateMatch(donation, reqItem, org);
      return {
        _id: `mth_${reqItem._id}`,
        donation,
        organization: org,
        requirement: reqItem,
        matchScore: evalResult.matchScore,
        reasoning: evalResult.reasoning,
        compatibilityScores: evalResult.compatibilityScores,
        distance: evalResult.distance,
        status: 'Recommended'
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({ success: true, count: reqMatches.length, data: reqMatches });
  } catch (error) {
    next(error);
  }
};

// @desc    Organization accepts a match
// @route   PUT /api/matches/:matchId/accept
// @access  Private
exports.acceptMatch = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const match = await Match.findById(req.params.matchId);
      if (!match) return res.status(404).json({ success: false, message: 'Match not found.' });

      match.status = 'Accepted';
      await match.save();
      await Donation.findByIdAndUpdate(match.donation, { status: 'Matched' });

      return res.status(200).json({ success: true, message: 'Match accepted.', data: match });
    }

    res.status(200).json({
      success: true,
      message: 'Match recommendation accepted.',
      data: { _id: req.params.matchId, status: 'Accepted' }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a match
// @route   PUT /api/matches/:matchId/reject
// @access  Private
exports.rejectMatch = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const match = await Match.findById(req.params.matchId);
      if (!match) return res.status(404).json({ success: false, message: 'Match not found.' });
      match.status = 'Rejected';
      await match.save();
      return res.status(200).json({ success: true, message: 'Match rejected.', data: match });
    }

    res.status(200).json({ success: true, message: 'Match rejected.', data: { _id: req.params.matchId, status: 'Rejected' } });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark donation as Delivered
// @route   PUT /api/matches/:matchId/delivered
// @access  Private
exports.deliveredMatch = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const match = await Match.findById(req.params.matchId);
      if (!match) return res.status(404).json({ success: false, message: 'Match not found.' });

      match.status = 'Delivered';
      await match.save();

      const donation = await Donation.findByIdAndUpdate(match.donation, { status: 'Delivered' }, { new: true });
      const qty = donation ? donation.quantity : 1;

      const requirement = await Requirement.findById(match.requirement);
      if (requirement) {
        requirement.quantityFulfilled += qty;
        requirement.status = requirement.quantityFulfilled >= requirement.quantityRequired ? 'Fulfilled' : 'Partially Fulfilled';
        await requirement.save();
      }

      return res.status(200).json({ success: true, message: 'Marked as Delivered.', data: match });
    }

    res.status(200).json({ success: true, message: 'Marked as Delivered.', data: { _id: req.params.matchId, status: 'Delivered' } });
  } catch (error) {
    next(error);
  }
};
