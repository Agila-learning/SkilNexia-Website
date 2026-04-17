const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        batch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Batch',
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        progress: {
            type: Number,
            default: 0, // percentage completed
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        certificateUrl: {
            type: String,
            default: '',
        },
        platform: {
            type: String,
            default: 'skilnexia',
            index: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Enrollment', enrollmentSchema);
