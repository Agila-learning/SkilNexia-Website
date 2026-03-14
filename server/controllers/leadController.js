const Lead = require('../models/Lead');
const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Batch = require('../models/Batch');
const bcrypt = require('bcryptjs');

exports.createLead = async (req, res) => {
    try {
        const { fullName, email, phone, courseId, message } = req.body;

        const lead = new Lead({
            fullName,
            email,
            phone,
            courseId,
            message
        });

        await lead.save();

        // TODO: Emulate sending email/notification to HR here

        res.status(201).json({
            success: true,
            message: "Expert will reach out to you shortly!",
            data: lead
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getLeads = async (req, res) => {
    try {
        const leads = await Lead.find()
            .populate('courseId', 'title')
            .sort('-createdAt');

        res.status(200).json(leads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getMyLeads = async (req, res) => {
    try {
        const leads = await Lead.find({ email: req.user.email })
            .populate('courseId', 'title thumbnail')
            .sort('-createdAt');

        res.status(200).json(leads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateLeadStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }

        const oldStatus = lead.status;
        lead.status = status;
        await lead.save();

        // If converted, create user and enrollment
        if (status === 'Converted' && oldStatus !== 'Converted') {
            // 1. Find or Create User
            let user = await User.findOne({ email: lead.email });
            if (!user) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('Skilnexia@123', salt);
                user = await User.create({
                    name: lead.fullName,
                    email: lead.email,
                    password: hashedPassword,
                    role: 'student'
                });
            }

            // 2. Find a Batch for the course
            const batch = await Batch.findOne({ course: lead.courseId }).sort('-createdAt');
            if (batch) {
                // 3. Create Enrollment
                const existingEnrollment = await Enrollment.findOne({ student: user._id, batch: batch._id });
                if (!existingEnrollment) {
                    await Enrollment.create({
                        student: user._id,
                        batch: batch._id,
                        paymentStatus: 'completed' // Assuming conversion follows payment
                    });

                    // 4. Update Batch and User
                    if (!batch.enrolledStudents.includes(user._id)) {
                        batch.enrolledStudents.push(user._id);
                        await batch.save();
                    }

                    if (!user.enrolledCourses.includes(lead.courseId)) {
                        user.enrolledCourses.push(lead.courseId);
                        await user.save();
                    }
                }
            }
        }

        res.status(200).json({
            success: true,
            message: `Lead status updated to ${status}`,
            data: lead
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
