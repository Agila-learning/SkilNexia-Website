const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    status: {
        type: String,
        enum: ['active', 'closed'],
        default: 'active'
    },
    topic: {
        type: String, // e.g., 'Course Support', 'Placement', 'Other'
        default: 'General'
    }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
