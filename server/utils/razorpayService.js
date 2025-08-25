const Razorpay = require('razorpay');

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay order
 * @param {number} amount - Amount in paise (smallest currency unit)
 * @param {string} currency - Currency code (default: INR)
 * @param {string} receipt - Receipt ID for the order
 * @returns {Promise<Object>} Razorpay order object
 */
const createOrder = async (amount, currency = 'INR', receipt = null) => {
    try {
        const options = {
            amount: amount, // amount in paise
            currency: currency,
            receipt: receipt || `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        return {
            success: true,
            order: order
        };
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Verify Razorpay payment signature
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @returns {boolean} True if signature is valid
 */
const verifyPaymentSignature = (orderId, paymentId, signature) => {
    try {
        const text = orderId + '|' + paymentId;
        const crypto = require('crypto');
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(text)
            .digest('hex');

        return generated_signature === signature;
    } catch (error) {
        console.error('Error verifying payment signature:', error);
        return false;
    }
};

/**
 * Get payment details by payment ID
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Promise<Object>} Payment details
 */
const getPaymentDetails = async (paymentId) => {
    try {
        const payment = await razorpay.payments.fetch(paymentId);
        return {
            success: true,
            payment: payment
        };
    } catch (error) {
        console.error('Error fetching payment details:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Refund a payment
 * @param {string} paymentId - Razorpay payment ID
 * @param {number} amount - Amount to refund in paise
 * @param {string} reason - Reason for refund
 * @returns {Promise<Object>} Refund details
 */
const refundPayment = async (paymentId, amount, reason = 'Customer request') => {
    try {
        const refund = await razorpay.payments.refund(paymentId, {
            amount: amount,
            reason: reason
        });
        return {
            success: true,
            refund: refund
        };
    } catch (error) {
        console.error('Error refunding payment:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    createOrder,
    verifyPaymentSignature,
    getPaymentDetails,
    refundPayment,
    razorpay
};
