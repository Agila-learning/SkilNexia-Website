const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getRazorpayKey, getMyPayments, getAllPayments } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/razorpay-key', getRazorpayKey);

router.get('/my', protect, getMyPayments);
router.get('/', protect, authorize('admin'), getAllPayments);

module.exports = router;
