const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser, getAdminStats, getEnrollmentReport } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.get('/stats', getAdminStats);
router.get('/enrollment-report', getEnrollmentReport);
router.route('/users/:id')
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;
