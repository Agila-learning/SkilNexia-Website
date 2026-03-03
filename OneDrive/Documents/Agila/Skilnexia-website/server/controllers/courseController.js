const Course = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
// @desc    Get all courses with filtering and search
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    try {
        const { category, level, search } = req.query;
        let query = {};

        if (category) query.category = category;
        if (level) query.level = level;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const courses = await Course.find(query).populate('trainers', 'name email');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('trainers', 'name email')
            .populate({
                path: 'batches',
                populate: { path: 'trainer', select: 'name email' }
            });

        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
    try {
        const {
            title, description, category, thumbnail, price, level,
            duration, trainers, certificationInfo, placementSupport,
            toolsCovered, projects, modules, faqs
        } = req.body;

        const course = new Course({
            title,
            description,
            category,
            thumbnail,
            price,
            level,
            duration,
            trainers,
            certificationInfo,
            placementSupport,
            toolsCovered,
            projects,
            modules,
            faqs,
        });

        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            course.title = req.body.title || course.title;
            course.description = req.body.description || course.description;
            course.category = req.body.category || course.category;
            course.thumbnail = req.body.thumbnail || course.thumbnail;
            course.price = req.body.price || course.price;
            course.level = req.body.level || course.level;
            course.duration = req.body.duration || course.duration;
            course.trainers = req.body.trainers || course.trainers;
            course.certificationInfo = req.body.certificationInfo || course.certificationInfo;
            course.placementSupport = req.body.placementSupport || course.placementSupport;
            course.toolsCovered = req.body.toolsCovered || course.toolsCovered;
            course.projects = req.body.projects || course.projects;
            course.modules = req.body.modules || course.modules;
            course.faqs = req.body.faqs || course.faqs;
            course.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : course.isPublished;

            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            await Course.findByIdAndDelete(req.params.id);
            res.json({ message: 'Course removed' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get trainer dashboard data
// @route   GET /api/courses/trainer/dashboard
// @access  Private/Trainer
const getTrainerDashboard = async (req, res) => {
    try {
        const Batch = require('../models/Batch');
        const Enrollment = require('../models/Enrollment');

        const batches = await Batch.find({ trainer: req.user._id }).populate('course', 'title thumbnail');
        const batchIds = batches.map(b => b._id);
        const enrollments = await Enrollment.find({ batch: { $in: batchIds } });

        const totalMentees = enrollments.length;
        const activeCohorts = batches.filter(b => b.endDate >= new Date() || !b.endDate).length;

        let lecturesUploaded = 0;
        let totalMinutesMentored = 0;

        batches.forEach(b => {
            if (b.lectures) {
                lecturesUploaded += b.lectures.length;
                b.lectures.forEach(l => {
                    totalMinutesMentored += (l.duration || 0);
                });
            }
        });

        res.json({
            stats: {
                totalMentees,
                activeCohorts,
                lecturesUploaded,
                hoursMentored: Math.round(totalMinutesMentored / 60)
            },
            batches: batches
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getTrainerDashboard,
};
