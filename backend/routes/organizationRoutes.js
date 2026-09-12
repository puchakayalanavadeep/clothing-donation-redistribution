const express = require('express');
const router = express.Router();
const {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  getMyProfile
} = require('../controllers/organizationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createOrganization)
  .get(getOrganizations);

router.get('/my/profile', protect, getMyProfile);

router.route('/:id')
  .get(getOrganizationById)
  .put(protect, updateOrganization);

module.exports = router;
