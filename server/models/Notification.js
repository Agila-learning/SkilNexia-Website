const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['badge', 'system', 'course', 'payment'],
            default: 'system',
        },
        link: {
            type: String,
        },
        isRead: {
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

module.exports = mongoose.model('Notification', notificationSchema);
