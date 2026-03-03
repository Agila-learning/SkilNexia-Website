const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        trainer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Trainer
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        schedule: {
            type: String, // e.g., "Mon-Wed-Fri 6 PM"
            required: true,
        },
        meetingLink: {
            type: String,
            default: '',
        },
        maxSeats: {
            type: Number,
            required: true,
            default: 50,
        },
        enrolledStudents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // Students
            },
        ],
        lectures: [
            {
                title: String,
                videoUrl: String, // Cloudinary URL
                duration: Number, // in minutes
                order: Number,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Batch', batchSchema);
