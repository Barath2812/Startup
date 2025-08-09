const express = require('express');
const { createPaymentIntent, processGooglePayPayment, validatePaymentResponse } = require('../utils/googlePayService');
const authUser = require('../middlewares/authUser');

const paymentRouter = express.Router();

// Create Google Pay payment intent
paymentRouter.post('/google-pay/create-intent', authUser, async (req, res) => {
    try {
        const { amount, orderId } = req.body;

        if (!amount || !orderId) {
            return res.status(400).json({
                success: false,
                message: 'Amount and orderId are required'
            });
        }

        const paymentIntent = await createPaymentIntent(amount, orderId);
        
        res.json({
            success: true,
            data: paymentIntent
        });
    } catch (error) {
        console.error('Error creating Google Pay intent:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment intent',
            error: error.message
        });
    }
});

// Process Google Pay payment
paymentRouter.post('/google-pay/process', authUser, async (req, res) => {
    try {
        const { paymentResponse, orderDetails } = req.body;

        if (!paymentResponse || !orderDetails) {
            return res.status(400).json({
                success: false,
                message: 'Payment response and order details are required'
            });
        }

        // Validate payment response
        const validation = validatePaymentResponse(paymentResponse);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment response',
                error: validation.error
            });
        }

        // Process the payment
        const paymentResult = await processGooglePayPayment(validation.paymentData, orderDetails);
        
        res.json({
            success: true,
            data: paymentResult,
            message: 'Payment processed successfully'
        });
    } catch (error) {
        console.error('Error processing Google Pay payment:', error);
        res.status(500).json({
            success: false,
            message: 'Payment processing failed',
            error: error.message
        });
    }
});

// Get Google Pay configuration
paymentRouter.get('/google-pay/config', (req, res) => {
    try {
        const { getGooglePayConfig } = require('../utils/googlePayService');
        const config = getGooglePayConfig();
        
        res.json({
            success: true,
            data: config
        });
    } catch (error) {
        console.error('Error getting Google Pay config:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get Google Pay configuration',
            error: error.message
        });
    }
});

module.exports = paymentRouter;
