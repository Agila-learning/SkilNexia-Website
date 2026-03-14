const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        trainer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        dueDate: {
            type: Date,
        },
        fileUrl: {
            type: String, // Optional reference material
        },
        submissions: [
            {
                student: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                fileUrl: String,
                submittedAt: Date,
                grade: String,
                feedback: String,
                status: {
                    type: String,
                    enum: ['pending', 'graded'],
                    default: 'pending',
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
