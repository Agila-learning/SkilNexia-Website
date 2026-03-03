const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');

// @desc    Get user enrollments
// @route   GET /api/enrollments
// @access  Private (Student)
const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user._id })
            .populate({
                path: 'batch',
                populate: [
                    { path: 'course', select: 'title thumbnail level' },
                    { path: 'trainer', select: 'name' }
                ]
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

// @desc    Mark enrollment as complete and generate certificate
// @route   PUT /api/enrollments/:id/complete
// @access  Private/Trainer or Admin
const completeEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id)
            .populate('student', 'name')
            .populate({
                path: 'batch',
                populate: { path: 'course', select: 'title' }
            });

        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        if (enrollment.progress === 100) {
            return res.status(400).json({ message: 'Enrollment is already completed' });
        }

        // Must be admin or the trainer of this batch
        if (req.user.role !== 'admin' && req.user.role !== 'hr') {
            // Further auth check for trainer can be added here
            if (req.user.role !== 'trainer') {
                return res.status(403).json({ message: 'Not authorized' });
            }
        }

        enrollment.progress = 100;
        await enrollment.save();

        // Check if certificate already exists
        let certificate = await Certificate.findOne({ user: enrollment.student._id, course: enrollment.batch.course._id });

        if (!certificate) {
            const certificateId = `SKLX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            certificate = await Certificate.create({
                user: enrollment.student._id,
                course: enrollment.batch.course._id,
                certificateId,
                // pdfUrl would be computed via Cloudinary in a real scenario
            });
        }

        res.json({ message: 'Enrollment completed successfully', enrollment, certificate });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMyEnrollments,
    getEnrollmentById,
    completeEnrollment
};
