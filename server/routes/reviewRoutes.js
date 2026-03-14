const express = require('express');
const router = express.Router();
const {
    getReviewsByCourse,
    createReview,
    updateReviewStatus,
    getAllApprovedReviews
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/all').get(getAllApprovedReviews);
router.route('/course/:courseId').get(getReviewsByCourse);
router.route('/').post(protect, authorize('student'), createReview);
router.route('/:id/status').put(protect, authorize('admin'), updateReviewStatus);

module.exports = router;
