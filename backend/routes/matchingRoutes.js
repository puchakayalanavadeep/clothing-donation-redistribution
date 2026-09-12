const express = require('express');
const router = express.Router();
const {
  generateMatches,
  getMatchesForDonation,
  acceptMatch,
  rejectMatch,
  deliveredMatch
} = require('../controllers/matchingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:donationId/generate', generateMatches);
router.get('/:donationId', getMatchesForDonation);
router.put('/:matchId/accept', protect, acceptMatch);
router.put('/:matchId/reject', protect, rejectMatch);
router.put('/:matchId/delivered', protect, deliveredMatch);

module.exports = router;
