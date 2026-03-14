const express = require('express');
const router = express.Router();
const { getChats, getMessages, createChat, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getChats);
router.post('/', createChat);
router.get('/:chatId/messages', getMessages);
router.post('/:chatId/messages', sendMessage);

module.exports = router;
