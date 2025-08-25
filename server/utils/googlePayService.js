const crypto = require('crypto');

// Google Pay configuration
const GOOGLE_PAY_CONFIG = {
    environment: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'TEST',
    // Google-assigned merchantId required in PRODUCTION only
    merchantId: process.env.GOOGLE_PAY_MERCHANT_ID,
    merchantName: process.env.GOOGLE_PAY_MERCHANT_NAME || 'Demo Store',
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
                    gateway: 'razorpay',
                    // Prefer dedicated Razorpay merchant ID if provided, fallback to key id for tests
                    gatewayMerchantId: process.env.RAZORPAY_MERCHANT_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id'
                }
            }
        }],
        transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPrice: amount.toString(),
            currencyCode: GOOGLE_PAY_CONFIG.currencyCode,
            countryCode: GOOGLE_PAY_CONFIG.countryCode
        },
        merchantInfo: GOOGLE_PAY_CONFIG.environment === 'PRODUCTION'
            ? { merchantId: GOOGLE_PAY_CONFIG.merchantId, merchantName: GOOGLE_PAY_CONFIG.merchantName }
            : { merchantName: GOOGLE_PAY_CONFIG.merchantName },
        callbackIntents: ['PAYMENT_AUTHORIZATION', 'SHIPPING_ADDRESS', 'SHIPPING_OPTION'],
        paymentDataCallbacks: {
            onPaymentAuthorized: (paymentData) => {
                console.log('Payment authorized:', paymentData);
                return {
                    result: 'SUCCESS'
                };
            },
            onPaymentDataChanged: (paymentData) => {
                console.log('Payment data changed:', paymentData);
                return {
                    newTransactionInfo: {
                        totalPriceStatus: 'FINAL',
                        totalPrice: amount.toString(),
                        currencyCode: GOOGLE_PAY_CONFIG.currencyCode,
                        countryCode: GOOGLE_PAY_CONFIG.countryCode
                    }
                };
            }
        }
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
        // 1. Send the token to your payment processor (Razorpay, etc.)
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
                    gateway: 'razorpay',
                    gatewayMerchantId: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id'
                }
            }
        }],
        callbackIntents: ['PAYMENT_AUTHORIZATION', 'SHIPPING_ADDRESS', 'SHIPPING_OPTION'],
        paymentDataCallbacks: {
            onPaymentAuthorized: (paymentData) => {
                console.log('Payment authorized:', paymentData);
                return {
                    result: 'SUCCESS'
                };
            },
            onPaymentDataChanged: (paymentData) => {
                console.log('Payment data changed:', paymentData);
                return {
                    newTransactionInfo: {
                        totalPriceStatus: 'FINAL',
                        totalPrice: paymentData.transactionInfo?.totalPrice || '0',
                        currencyCode: GOOGLE_PAY_CONFIG.currencyCode,
                        countryCode: GOOGLE_PAY_CONFIG.countryCode
                    }
                };
            }
        }
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
        // Accept both shapes: { paymentData: {...} } and raw paymentData {...}
        const paymentData = paymentResponse?.paymentData || paymentResponse;

        if (!paymentData) {
            throw new Error('Invalid payment response');
        }

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
