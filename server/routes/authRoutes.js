const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, setupAccounts } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.get('/setup-accounts', setupAccounts);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
