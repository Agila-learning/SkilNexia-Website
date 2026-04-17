const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        thumbnail: {
            type: String,
            required: true, // Cloudinary URL
        },
        price: {
            type: Number,
            required: true,
        },
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner',
        },
        duration: {
            type: String,
            required: true,
        },
        certificationInfo: {
            type: String,
            default: 'Industry recognized certificate upon completion.',
        },
        placementSupport: {
            type: String,
            default: 'Dedicated placement assistance available.',
        },
        toolsCovered: [
            {
                type: String,
            },
        ],
        projects: [
            {
                title: String,
                description: String,
            },
        ],
        modules: [
            {
                title: {
                    type: String,
                    required: true,
                },
                content: String,
                duration: String,
            },
        ],
        faqs: [
            {
                question: String,
                answer: String,
            },
        ],
        trainers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // Users with role 'trainer'
            },
        ],
        batches: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Batch',
            },
        ],
        rating: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        courseType: {
            type: String,
            enum: ['offline', 'paid'],
            default: 'paid',
        },
        trainingType: {
            type: String,
            enum: ['recorded', 'live'],
            default: 'live',
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        platform: {
            type: String,
            default: 'skilnexia',
            index: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
