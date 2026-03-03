const Batch = require('../models/Batch');
const Course = require('../models/Course');

// @desc    Get batches for a course
// @route   GET /api/courses/:courseId/batches
// @access  Public
const getBatchesByCourse = async (req, res) => {
    try {
        const batches = await Batch.find({ course: req.params.courseId }).populate('trainer', 'name email');
        res.json(batches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a batch for a course
// @route   POST /api/courses/:courseId/batches
// @access  Private/Admin
const createBatch = async (req, res) => {
    try {
        const { trainer, name, startDate, endDate, schedule, maxSeats } = req.body;
        const courseId = req.params.courseId;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const batch = new Batch({
            course: courseId,
            trainer,
            name,
            startDate,
            endDate,
            schedule,
            maxSeats,
        });

        const createdBatch = await batch.save();

        // Add batch reference to course
        course.batches.push(createdBatch._id);
        await course.save();

        res.status(201).json(createdBatch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBatchesByCourse,
    createBatch,
};
