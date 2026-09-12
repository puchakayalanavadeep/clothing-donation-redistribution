const express = require('express');
const router = express.Router();
const {
  createDonation,
  getDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
  getMyDonations
} = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createDonation)
  .get(getDonations);

router.get('/my-donations', protect, getMyDonations);

router.route('/:id')
  .get(getDonationById)
  .put(protect, updateDonation)
  .delete(protect, deleteDonation);

module.exports = router;
