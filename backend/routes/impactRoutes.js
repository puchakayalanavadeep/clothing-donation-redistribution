const express = require('express');
const router = express.Router();
const { getPlatformImpact, getMyImpact } = require('../controllers/impactController');
const { protect } = require('../middleware/authMiddleware');

router.get('/platform', getPlatformImpact);
router.get('/my-impact', protect, getMyImpact);

module.exports = router;
