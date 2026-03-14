const Batch = require('../models/Batch');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');

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

// @desc    Update a batch (Trainer updating meeting link)
// @route   PUT /api/courses/:courseId/batches/:batchId
// @access  Private/Trainer or Admin
const updateBatch = async (req, res) => {
    try {
        const { meetingLink } = req.body;
        const batch = await Batch.findById(req.params.batchId);

        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        // Must be admin or the trainer of this batch
        if (req.user.role !== 'admin' && batch.trainer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this batch' });
        }

        if (meetingLink !== undefined) batch.meetingLink = meetingLink;

        const updatedBatch = await batch.save();
        res.json(updatedBatch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Complete a batch (Trainer marking cohort as finished)
// @route   PUT /api/courses/:courseId/batches/:batchId/complete
// @access  Private/Trainer or Admin
const completeBatch = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.batchId);

        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        // Must be admin or the trainer of this batch
        if (req.user.role !== 'admin' && batch.trainer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to complete this batch' });
        }

        const enrollments = await Enrollment.find({ batch: batch._id });

        for (const enrollment of enrollments) {
            if (enrollment.progress < 100) {
                enrollment.progress = 100;
                await enrollment.save();

                const existingCert = await Certificate.findOne({ user: enrollment.student, course: batch.course });
                if (!existingCert) {
                    await Certificate.create({
                        user: enrollment.student,
                        course: batch.course,
                        certificateId: `SKLX-${Date.now()}-${Math.floor(Math.random() * 1000)}`
                    });
                }
            }
        }

        res.json({ message: 'Batch marked as completed. Certificates generated for all students.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a lecture to a batch
// @route   POST /api/courses/:courseId/batches/:batchId/lectures
// @access  Private/Trainer or Admin
const addLecture = async (req, res) => {
    try {
        const { title, videoUrl, duration, materialUrl, materialName } = req.body;
        const batch = await Batch.findById(req.params.batchId);

        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        // Must be admin or the trainer of this batch
        if (req.user.role !== 'admin' && batch.trainer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to add lectures to this batch' });
        }

        const newLecture = {
            title,
            videoUrl,
            duration: parseInt(duration),
            order: batch.lectures.length + 1,
            materialUrl,
            materialName
        };

        batch.lectures.push(newLecture);
        await batch.save();

        res.status(201).json({ success: true, data: newLecture });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBatchesByCourse,
    createBatch,
    updateBatch,
    completeBatch,
    addLecture
};
