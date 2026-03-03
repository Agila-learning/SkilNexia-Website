const express = require('express');
const router = express.Router();
const {
    getMyCertificates,
    generateCertificate,
    downloadCertificate
} = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/my').get(protect, getMyCertificates);
router.route('/generate').post(protect, authorize('admin'), generateCertificate);
router.route('/:id/download').get(protect, downloadCertificate);

module.exports = router;
