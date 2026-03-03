const Lead = require('../models/Lead');
const Course = require('../models/Course');

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
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('courseId', 'title');

        if (!lead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }

        // TODO: Emulate sending the payment link to candidate if status === 'Payment Pending'/'Converted'

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
