const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ platform: 'skilnexia' }).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.role = req.body.role || user.role;
            user.status = req.body.status || user.status;
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                status: updatedUser.status
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await User.findByIdAndDelete(req.params.id);
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
    try {
        const Course = require('../models/Course');
        const Enrollment = require('../models/Enrollment');

        const totalStudents = await User.countDocuments({ role: 'student', platform: 'skilnexia' });
        const totalTrainers = await User.countDocuments({ role: 'trainer', platform: 'skilnexia' });
        const activeCourses = await Course.countDocuments({ isPublished: true });

        // Simple revenue calculation (sum of all verified payments)
        const enrollments = await Enrollment.find({ status: 'active' }).populate('course', 'price');
        const revenue = enrollments.reduce((sum, enr) => sum + (enr.course?.price || 0), 0);

        res.json({
            totalStudents,
            totalTrainers,
            activeCourses,
            revenue: `₹${revenue.toLocaleString()}`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all enrollment data as CSV
// @route   GET /api/admin/enrollment-report
// @access  Private/Admin
exports.getEnrollmentReport = async (req, res) => {
    try {
        const Enrollment = require('../models/Enrollment');
        const enrollments = await Enrollment.find({}).populate('user', 'name email').populate('course', 'title price');

        let csv = 'Enrollment ID,Student Name,Email,Course,Price,Status,Date\n';
        enrollments.forEach(enr => {
            const row = [
                enr._id,
                enr.user?.name || 'N/A',
                enr.user?.email || 'N/A',
                enr.course?.title || 'N/A',
                enr.course?.price || 0,
                enr.status,
                new Date(enr.createdAt).toLocaleDateString()
            ];
            csv += row.join(',') + '\n';
        });

        res.header('Content-Type', 'text/csv');
        res.attachment(`enrollment-report-${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csv);
    } catch (error) {
        console.error('Report error:', error);
        res.status(500).json({ message: error.message });
    }
};
