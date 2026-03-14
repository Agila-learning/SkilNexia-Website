const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getTrainerDashboard,
    getAdminCourses
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCourses)
    .post(protect, authorize('admin', 'hr'), createCourse);

router.route('/admin/all')
    .get(protect, authorize('admin', 'hr'), getAdminCourses);

router.route('/trainer/dashboard')
    .get(protect, authorize('trainer', 'admin'), getTrainerDashboard);

router.route('/:id')
    .get(getCourseById)
    .put(protect, authorize('admin', 'hr', 'trainer'), updateCourse)
    .delete(protect, authorize('admin'), deleteCourse);

module.exports = router;
