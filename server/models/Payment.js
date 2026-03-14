const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        enrollment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Enrollment',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: 'INR',
        },
        razorpayOrderId: {
            type: String,
            required: true,
        },
        razorpayPaymentId: {
            type: String,
        },
        status: {
            type: String,
            enum: ['created', 'authorized', 'captured', 'refunded', 'failed'],
            default: 'created',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
