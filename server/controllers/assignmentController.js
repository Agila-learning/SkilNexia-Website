const Assignment = require('../models/Assignment');

// @desc    Get assignments for a course
// @route   GET /api/assignments/course/:courseId
// @access  Private
const getAssignmentsByCourse = async (req, res) => {
    try {
        const assignments = await Assignment.find({ course: req.params.courseId })
            .populate('trainer', 'name email')
            .populate('submissions.student', 'name email');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an assignment
// @route   POST /api/assignments
// @access  Private/Trainer/Admin
const createAssignment = async (req, res) => {
    try {
        const { title, description, courseId, dueDate, fileUrl } = req.body;
        const assignment = new Assignment({
            title,
            description,
            course: courseId,
            trainer: req.user._id,
            dueDate,
            fileUrl,
        });
        const createdAssignment = await assignment.save();
        res.status(201).json(createdAssignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit an assignment
// @route   POST /api/assignments/:id/submit
// @access  Private/Student
const submitAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (assignment) {
            const submission = {
                student: req.user._id,
                fileUrl: req.body.fileUrl,
                submittedAt: Date.now(),
            };
            assignment.submissions.push(submission);
            await assignment.save();
            res.status(201).json({ message: 'Assignment submitted successfully' });
        } else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Grade an assignment
// @route   PUT /api/assignments/:id/grade/:submissionId
// @access  Private/Trainer/Admin
const gradeAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (assignment) {
            const submission = assignment.submissions.id(req.params.submissionId);
            if (submission) {
                submission.grade = req.body.grade;
                submission.feedback = req.body.feedback;
                submission.status = 'graded';
                await assignment.save();
                res.json({ message: 'Assignment graded successfully' });
            } else {
                res.status(404).json({ message: 'Submission not found' });
            }
        } else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAssignmentsByCourse,
    createAssignment,
    submitAssignment,
    gradeAssignment,
};
