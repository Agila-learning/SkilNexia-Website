const Enrollment = require('../models/Enrollment');
const Certificate = require('../models/Certificate');
const nodemailer = require('nodemailer');

// Shared email transporter
const createTransporter = () => nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

const sendCertificateEmail = async (toEmail, studentName, courseTitle, certificateId) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('[Email] EMAIL_USER or EMAIL_PASS not set. Skipping certificate email.');
        return;
    }
    try {
        const transporter = createTransporter();
        await transporter.sendMail({
            from: `"SkilNexia" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `🎓 Your SkilNexia Certificate – ${courseTitle}`,
            html: `
                <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background:#f8fafc; padding:40px 0;">
                    <div style="max-width:600px; margin:0 auto; background:white; border-radius:24px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                        <div style="background:linear-gradient(135deg,#2563eb,#7c3aed); padding:40px; text-align:center;">
                            <h1 style="color:white; margin:0; font-size:28px; font-weight:900; letter-spacing:-0.5px;">🎓 Congratulations, ${studentName}!</h1>
                        </div>
                        <div style="padding:40px;">
                            <p style="color:#334155; font-size:16px; line-height:1.6;">You have successfully completed <strong>${courseTitle}</strong> on <strong>SkilNexia</strong>.</p>
                            <div style="background:#f1f5f9; border-radius:16px; padding:24px; margin:24px 0; text-align:center;">
                                <p style="color:#64748b; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:2px; margin:0 0 8px;">Certificate ID</p>
                                <p style="color:#1e293b; font-size:24px; font-weight:900; margin:0; font-family:monospace;">${certificateId}</p>
                            </div>
                            <p style="color:#334155; font-size:14px;">This certificate validates your achievement and can be shared with employers or on your professional profile.</p>
                            <p style="color:#94a3b8; font-size:12px; margin-top:32px;">— The SkilNexia Team</p>
                        </div>
                    </div>
                </div>
            `
        });
        console.log(`[Email] Certificate email sent to ${toEmail}`);
    } catch (err) {
        console.error('[Email] Failed to send certificate email:', err.message);
    }
};

// @desc    Get user enrollments
// @route   GET /api/enrollments
// @access  Private (Student)
const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user._id })
            .populate({
                path: 'batch',
                populate: [
                    { path: 'course', select: 'title thumbnail level courseType trainingType' },
                    { path: 'trainer', select: 'name' },
                    { path: 'materials' } // Materials is an array of subdocs, but we need to ensure it's selected
                ]
            });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all enrollments (Admin/HR/Trainer view)
// @route   GET /api/enrollments/all
// @access  Private/Admin,HR,Trainer
const getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({})
            .populate('student', 'name email')
            .populate({
                path: 'batch',
                populate: [
                    { path: 'course', select: 'title' },
                    { path: 'trainer', select: 'name' }
                ]
            })
            .sort({ createdAt: -1 });
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
                    { path: 'course', select: 'title thumbnail description level courseType trainingType' },
                    { path: 'trainer', select: 'name email profileImage' },
                    { path: 'materials' }
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

// @desc    Mark enrollment as complete and generate + email certificate
// @route   PUT /api/enrollments/:id/complete
// @access  Private/Trainer, HR, or Admin
const completeEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id)
            .populate('student', 'name email')
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

        // Must be admin, hr, or trainer
        if (!['admin', 'hr', 'trainer'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Not authorized' });
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
            });

            // Send certificate email to student
            await sendCertificateEmail(
                enrollment.student.email,
                enrollment.student.name,
                enrollment.batch.course.title,
                certificateId
            );
        }

        res.json({ message: 'Enrollment completed. Certificate issued and emailed.', enrollment, certificate });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMyEnrollments,
    getAllEnrollments,
    getEnrollmentById,
    completeEnrollment
};

