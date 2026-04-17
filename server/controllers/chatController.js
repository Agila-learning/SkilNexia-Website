const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get all chats for a user
// @route   GET /api/chats
// @access  Private
exports.getChats = async (req, res) => {
    try {
        let query = { participants: { $in: [req.user.id] } };

        // Admins and HR can see all chats
        if (req.user.role === 'admin' || req.user.role === 'hr') {
            query = {};
        }

        const chats = await Chat.find(query)
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
        const guestId = req.headers['x-guest-id'] || req.body.guestId;

        // If no participantId provided, find an admin
        if (!participantId) {
            const admin = await User.findOne({ role: 'admin' });
            if (!admin) {
                return res.status(404).json({ success: false, message: 'No support agent available' });
            }
            participantId = admin._id;
        }

        // Check if chat already exists
        let query = {};
        if (req.user) {
            query = { participants: { $all: [req.user.id, participantId] } };
        } else if (guestId) {
            query = { guestId, status: 'active' };
        } else {
            return res.status(400).json({ success: false, message: 'User or Guest ID required' });
        }

        let chat = await Chat.findOne({ ...query, status: 'active' });

        if (!chat) {
            chat = await Chat.create({
                participants: req.user ? [req.user.id, participantId] : [participantId],
                guestId: req.user ? undefined : guestId,
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
    const guestId = req.headers['x-guest-id'] || req.body.guestId;

    try {
        const messageData = {
            chatId,
            content
        };

        if (req.user) {
            messageData.sender = req.user.id;
        } else if (guestId) {
            messageData.guestId = guestId;
        } else {
            return res.status(400).json({ success: false, message: 'User or Guest ID required' });
        }

        const message = await Message.create(messageData);

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message._id
        });

        const populatedMessage = await Message.findById(message._id);
        if (message.sender) await populatedMessage.populate('sender', 'name avatar');

        res.status(201).json({
            success: true,
            data: populatedMessage
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
