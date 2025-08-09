const crypto = require('crypto');

// Google Pay configuration
const GOOGLE_PAY_CONFIG = {
    environment: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'TEST',
    merchantId: process.env.GOOGLE_PAY_MERCHANT_ID || '12345678901234567890',
    merchantName: process.env.GOOGLE_PAY_MERCHANT_NAME || 'RootCare Store',
    allowedCardNetworks: ['MASTERCARD', 'VISA'],
    allowedCardAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
    countryCode: 'IN',
    currencyCode: 'INR'
};

// Generate Google Pay payment data request
const generatePaymentDataRequest = (amount, orderId) => {
    const paymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
            type: 'CARD',
            parameters: {
                allowedAuthMethods: GOOGLE_PAY_CONFIG.allowedCardAuthMethods,
                allowedCardNetworks: GOOGLE_PAY_CONFIG.allowedCardNetworks,
                billingAddressRequired: true,
                billingAddressParameters: {
                    format: 'FULL',
                    phoneNumberRequired: true
                }
            },
            tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                    gateway: 'stripe',
                    gatewayMerchantId: process.env.STRIPE_ACCOUNT_ID || 'acct_1234567890'
                }
            }
        }],
        transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPrice: amount.toString(),
            currencyCode: GOOGLE_PAY_CONFIG.currencyCode,
            countryCode: GOOGLE_PAY_CONFIG.countryCode
        },
        merchantInfo: {
            merchantId: GOOGLE_PAY_CONFIG.merchantId,
            merchantName: GOOGLE_PAY_CONFIG.merchantName
        },
        callbackIntents: ['PAYMENT_AUTHORIZATION', 'SHIPPING_ADDRESS', 'SHIPPING_OPTION']
    };

    return paymentDataRequest;
};

// Verify Google Pay payment token
const verifyPaymentToken = (paymentData) => {
    try {
        // In a real implementation, you would verify the payment token with Google
        // For now, we'll do basic validation
        if (!paymentData || !paymentData.paymentMethodData || !paymentData.paymentMethodData.tokenizationData) {
            throw new Error('Invalid payment data');
        }

        const tokenizationData = paymentData.paymentMethodData.tokenizationData;
        
        // Verify token type
        if (tokenizationData.type !== 'PAYMENT_GATEWAY') {
            throw new Error('Invalid tokenization type');
        }

        // Verify token
        if (!tokenizationData.token) {
            throw new Error('Missing payment token');
        }

        return {
            isValid: true,
            token: tokenizationData.token,
            paymentMethodType: paymentData.paymentMethodData.type
        };
    } catch (error) {
        console.error('Payment token verification failed:', error.message);
        return {
            isValid: false,
            error: error.message
        };
    }
};

// Process Google Pay payment
const processGooglePayPayment = async (paymentData, orderDetails) => {
    try {
        // Verify the payment token
        const verification = verifyPaymentToken(paymentData);
        
        if (!verification.isValid) {
            throw new Error(`Payment verification failed: ${verification.error}`);
        }

        // In a real implementation, you would:
        // 1. Send the token to your payment processor (Stripe, etc.)
        // 2. Process the payment
        // 3. Return the result

        // For demo purposes, we'll simulate a successful payment
        const paymentResult = {
            success: true,
            transactionId: `gpay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            amount: orderDetails.amount,
            currency: 'INR',
            paymentMethod: 'Google Pay',
            status: 'completed',
            timestamp: new Date().toISOString()
        };

        console.log('Google Pay payment processed successfully:', paymentResult);
        return paymentResult;

    } catch (error) {
        console.error('Google Pay payment processing failed:', error.message);
        throw error;
    }
};

// Generate client-side Google Pay configuration
const getGooglePayConfig = () => {
    return {
        environment: GOOGLE_PAY_CONFIG.environment,
        merchantInfo: {
            merchantId: GOOGLE_PAY_CONFIG.merchantId,
            merchantName: GOOGLE_PAY_CONFIG.merchantName
        },
        allowedPaymentMethods: [{
            type: 'CARD',
            parameters: {
                allowedAuthMethods: GOOGLE_PAY_CONFIG.allowedCardAuthMethods,
                allowedCardNetworks: GOOGLE_PAY_CONFIG.allowedCardNetworks,
                billingAddressRequired: true,
                billingAddressParameters: {
                    format: 'FULL',
                    phoneNumberRequired: true
                }
            },
            tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                    gateway: 'stripe',
                    gatewayMerchantId: process.env.STRIPE_ACCOUNT_ID || 'acct_1234567890'
                }
            }
        }],
        callbackIntents: ['PAYMENT_AUTHORIZATION', 'SHIPPING_ADDRESS', 'SHIPPING_OPTION']
    };
};

// Create payment intent for Google Pay
const createPaymentIntent = async (amount, orderId) => {
    try {
        const paymentDataRequest = generatePaymentDataRequest(amount, orderId);
        
        return {
            success: true,
            paymentDataRequest,
            config: getGooglePayConfig()
        };
    } catch (error) {
        console.error('Error creating payment intent:', error.message);
        throw error;
    }
};

// Validate payment response
const validatePaymentResponse = (paymentResponse) => {
    try {
        if (!paymentResponse || !paymentResponse.paymentData) {
            throw new Error('Invalid payment response');
        }

        const { paymentData } = paymentResponse;
        
        // Validate payment data structure
        if (!paymentData.paymentMethodData || !paymentData.paymentMethodData.tokenizationData) {
            throw new Error('Invalid payment data structure');
        }

        // Validate transaction info
        if (!paymentData.transactionInfo || !paymentData.transactionInfo.totalPrice) {
            throw new Error('Invalid transaction info');
        }

        return {
            isValid: true,
            paymentData
        };
    } catch (error) {
        console.error('Payment response validation failed:', error.message);
        return {
            isValid: false,
            error: error.message
        };
    }
};

module.exports = {
    generatePaymentDataRequest,
    verifyPaymentToken,
    processGooglePayPayment,
    getGooglePayConfig,
    createPaymentIntent,
    validatePaymentResponse,
    GOOGLE_PAY_CONFIG
};
