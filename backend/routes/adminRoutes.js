const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getPendingOrganizations,
  verifyOrganization,
  rejectOrganization,
  getAllUsers,
  updateUserStatus
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All admin routes protected & restricted to 'admin' role
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/organizations/pending', getPendingOrganizations);
router.put('/organizations/:id/verify', verifyOrganization);
router.put('/organizations/:id/reject', rejectOrganization);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);

module.exports = router;
