const express = require('express');
const router = express.Router();
const { getChats, getMessages, createChat } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All chat routes need authentication

router.get('/', getChats);
router.get('/:chatId/messages', getMessages);
router.post('/', createChat);

module.exports = router;
