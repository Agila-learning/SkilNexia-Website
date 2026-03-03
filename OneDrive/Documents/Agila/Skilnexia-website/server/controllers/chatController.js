const Chat = require('../models/Chat');
const Message = require('../models/Message');

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
    const { participantId, topic } = req.body;

    try {
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
