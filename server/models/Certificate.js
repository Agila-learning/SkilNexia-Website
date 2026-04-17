const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        certificateId: {
            type: String,
            required: true,
            unique: true,
        },
        issueDate: {
            type: Date,
            default: Date.now,
        },
        pdfUrl: {
            type: String, // Cloudinary URL or local path
        },
        platform: {
            type: String,
            default: 'skilnexia',
            index: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);
