const express = require('express');
const router = express.Router();
const {
  createRequirement,
  getRequirements,
  getRequirementById,
  updateRequirement,
  deleteRequirement,
  getMyRequirements
} = require('../controllers/requirementController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createRequirement)
  .get(getRequirements);

router.get('/my-requirements', protect, getMyRequirements);

router.route('/:id')
  .get(getRequirementById)
  .put(protect, updateRequirement)
  .delete(protect, deleteRequirement);

module.exports = router;
