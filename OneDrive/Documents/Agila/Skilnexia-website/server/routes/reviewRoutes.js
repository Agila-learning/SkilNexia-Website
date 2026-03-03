const express = require('express');
const router = express.Router();
const {
    getReviewsByCourse,
    createReview,
    updateReviewStatus
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/course/:courseId').get(getReviewsByCourse);
router.route('/').post(protect, authorize('student'), createReview);
router.route('/:id/status').put(protect, authorize('admin'), updateReviewStatus);

module.exports = router;
