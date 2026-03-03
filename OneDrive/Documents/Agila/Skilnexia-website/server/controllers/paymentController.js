const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Batch = require('../models/Batch');

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private (Student)
const createOrder = async (req, res) => {
    try {
        const { batchId } = req.body;

        const batch = await Batch.findById(batchId).populate('course');
        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        // Check if seats are available
        if (batch.enrolledStudents.length >= batch.maxSeats) {
            return res.status(400).json({ message: 'Batch is full' });
        }

        const amount = batch.course.price * 100; // Razorpay expects amount in paise

        const options = {
            amount,
            currency: 'INR',
            receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
        };

        const order = await razorpay.orders.create(options);

        // Create pending enrollment
        let enrollment = await Enrollment.findOne({ student: req.user._id, batch: batchId });
        if (!enrollment) {
            enrollment = await Enrollment.create({
                student: req.user._id,
                batch: batchId,
                paymentStatus: 'pending'
            });
        }

        // Create payment record
        await Payment.create({
            student: req.user._id,
            enrollment: enrollment._id,
            amount: batch.course.price,
            razorpayOrderId: order.id,
            status: 'created'
        });

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            enrollmentId: enrollment._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, enrollmentId } = req.body;

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            // Payment is authentic
            const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
            if (payment) {
                payment.status = 'captured';
                payment.razorpayPaymentId = razorpay_payment_id;
                await payment.save();
            }

            const enrollment = await Enrollment.findById(enrollmentId);
            if (enrollment) {
                enrollment.paymentStatus = 'completed';
                await enrollment.save();

                // Update user enrolled courses
                const user = req.user;
                if (!user.enrolledCourses.includes(enrollment.batch.course)) {
                    user.enrolledCourses.push(enrollment.batch.course);
                    await user.save();
                }

                // Update batch students
                const batch = await Batch.findById(enrollment.batch);
                if (batch && !batch.enrolledStudents.includes(req.user._id)) {
                    batch.enrolledStudents.push(req.user._id);
                    await batch.save();
                }
            }

            return res.json({ message: 'Payment verified successfully', success: true });
        } else {
            return res.status(400).json({ message: 'Invalid signature sent!', success: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
};
