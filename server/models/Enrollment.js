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
        badges: [
            {
                title: String,
                icon: String,
                awardedAt: { type: Date, default: Date.now }
            }
        ],
        score: {
            type: Number,
            default: 0,
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
