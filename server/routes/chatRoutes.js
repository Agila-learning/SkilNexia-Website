const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { getChats, createChat, getMessages, sendMessage, getAvailableUsers } = require('../controllers/chatController');

router.get('/', protect, getChats);
router.get('/users', protect, getAvailableUsers);
router.post('/', optionalAuth, createChat);
router.get('/:chatId/messages', optionalAuth, getMessages);
router.post('/:chatId/messages', optionalAuth, sendMessage);

module.exports = router;
