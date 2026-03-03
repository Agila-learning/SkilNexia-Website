const express = require('express');
const router = express.Router();
const {
    getAssignmentsByCourse,
    createAssignment,
    submitAssignment,
    gradeAssignment
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/course/:courseId').get(protect, getAssignmentsByCourse);
router.route('/').post(protect, authorize('trainer', 'admin'), createAssignment);
router.route('/:id/submit').post(protect, authorize('student'), submitAssignment);
router.route('/:id/grade/:submissionId').put(protect, authorize('trainer', 'admin'), gradeAssignment);

module.exports = router;
