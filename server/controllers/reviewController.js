const Review = require('../models/Review');
const Course = require('../models/Course');

// @desc    Get all reviews for a course
// @route   GET /api/reviews/course/:courseId
// @access  Public
const getReviewsByCourse = async (req, res) => {
    try {
        const reviews = await Review.find({
            course: req.params.courseId,
            status: 'approved'
        }).populate('user', 'name profileImage');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private/Student
const createReview = async (req, res) => {
    try {
        const { courseId, rating, comment } = req.body;

        // Check if user is enrolled in the course (Logic can be added here)

        const review = new Review({
            user: req.user._id,
            course: courseId,
            rating,
            comment,
            isVerified: true, // Assuming enrollment check passed
        });

        const createdReview = await review.save();

        // Update course rating
        const course = await Course.findById(courseId);
        const reviews = await Review.find({ course: courseId, status: 'approved' });
        course.numReviews = reviews.length;
        course.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        await course.save();

        res.status(201).json(createdReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update review status (Admin only)
// @route   PUT /api/reviews/:id/status
// @access  Private/Admin
const updateReviewStatus = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (review) {
            review.status = req.body.status || review.status;
            const updatedReview = await review.save();
            res.json(updatedReview);
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all approved reviews
// @route   GET /api/reviews/all
// @access  Public
const getAllApprovedReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ status: 'approved' })
            .populate('user', 'name profileImage')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getReviewsByCourse,
    createReview,
    updateReviewStatus,
    getAllApprovedReviews,
};
