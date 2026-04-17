const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    message: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Payment Pending', 'Converted', 'Rejected', 'Interview Scheduled', 'Offer Extended'],
        default: 'New'
    },
    source: {
        type: String,
        enum: ['Direct', 'Referral', 'Social Media', 'Other'],
        default: 'Direct'
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    platform: {
        type: String,
        default: 'skilnexia',
        index: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
