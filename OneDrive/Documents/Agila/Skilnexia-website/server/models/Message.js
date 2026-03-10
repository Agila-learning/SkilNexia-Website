const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    guestId: {
        type: String
    },
    content: {
        type: String,
        required: function () { return this.messageType === 'text'; }
    },
    messageType: {
        type: String,
        enum: ['text', 'audio', 'file'],
        default: 'text'
    },
    fileUrl: {
        type: String
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
