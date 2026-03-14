const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', protect, upload.single('file'), uploadFile);

module.exports = router;
