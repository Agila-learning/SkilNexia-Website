const Enrollment = require('../models/Enrollment');

// @desc    Get user enrollments
// @route   GET /api/enrollments
// @access  Private (Student)
const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user._id })
            .populate({
                path: 'batch',
                populate: { path: 'course', select: 'title thumbnail level' }
            });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single enrollment detail
// @route   GET /api/enrollments/:id
// @access  Private
const getEnrollmentById = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id)
            .populate({
                path: 'batch',
                populate: [
                    { path: 'course', select: 'title thumbnail description level' },
                    { path: 'trainer', select: 'name email profileImage' }
                ]
            });

        if (enrollment && (enrollment.student.toString() === req.user._id.toString() || req.user.role === 'admin' || req.user.role === 'hr')) {
            res.json(enrollment);
        } else {
            res.status(404).json({ message: 'Enrollment not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMyEnrollments,
    getEnrollmentById
};
