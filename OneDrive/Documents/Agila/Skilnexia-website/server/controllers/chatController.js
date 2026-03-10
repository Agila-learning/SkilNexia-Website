const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get all chats for a user
// @route   GET /api/chats
// @access  Private
exports.getChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            participants: { $in: [req.user.id] }
        })
            .populate('participants', 'name email role avatar')
            .populate('latestMessage')
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            data: chats
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get messages for a specific chat
// @route   GET /api/chats/:chatId/messages
// @access  Private
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chatId: req.params.chatId })
            .populate('sender', 'name avatar')
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Create or find a chat between student and admin/trainer
// @route   POST /api/chats
// @access  Private
exports.createChat = async (req, res) => {
    let { participantId, topic } = req.body;

    try {
        // If no participantId provided, find an admin
        if (!participantId) {
            const admin = await User.findOne({ role: 'admin' });
            if (!admin) {
                return res.status(404).json({ success: false, message: 'No support agent available' });
            }
            participantId = admin._id;
        }

        // Check if chat already exists
        let chat = await Chat.findOne({
            participants: { $all: [req.user.id, participantId] },
            status: 'active'
        });

        if (!chat) {
            chat = await Chat.create({
                participants: [req.user.id, participantId],
                topic: topic || 'General'
            });
        }

        res.status(201).json({
            success: true,
            data: chat
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Send a message in a chat
// @route   POST /api/chats/:chatId/messages
// @access  Private
exports.sendMessage = async (req, res) => {
    const { content } = req.body;
    const { chatId } = req.params;

    try {
        const message = await Message.create({
            chatId,
            sender: req.user.id,
            content
        });

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message._id
        });

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'name avatar');

        res.status(201).json({
            success: true,
            data: populatedMessage
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
