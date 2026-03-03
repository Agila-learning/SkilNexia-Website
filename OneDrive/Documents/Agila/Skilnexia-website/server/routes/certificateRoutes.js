const express = require('express');
const router = express.Router();
const {
    getMyCertificates,
    generateCertificate
} = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/my').get(protect, getMyCertificates);
router.route('/generate').post(protect, authorize('admin'), generateCertificate);

module.exports = router;
