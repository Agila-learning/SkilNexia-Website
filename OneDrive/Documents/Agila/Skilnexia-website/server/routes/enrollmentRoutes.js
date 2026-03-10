const express = require('express');
const router = express.Router();
const { getMyEnrollments, getAllEnrollments, getEnrollmentById, completeEnrollment } = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getMyEnrollments);

router.route('/all')
    .get(protect, authorize('admin', 'hr', 'trainer'), getAllEnrollments);

router.route('/:id')
    .get(protect, getEnrollmentById);

router.route('/:id/complete')
    .put(protect, authorize('admin', 'hr', 'trainer'), completeEnrollment);

module.exports = router;
