const express = require('express');
const router = express.Router();
const { getMyEnrollments, getEnrollmentById } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getMyEnrollments);

router.route('/:id')
    .get(protect, getEnrollmentById);

module.exports = router;
