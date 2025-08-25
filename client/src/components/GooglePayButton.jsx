import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';

const GooglePayButton = ({ amount, orderId, onSuccess, onError, disabled = false }) => {
    const { axios, toast } = useAppContext();
    const [isGooglePayAvailable, setIsGooglePayAvailable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [googlePayClient, setGooglePayClient] = useState(null);

    useEffect(() => {
        // Check if Google Pay is available
        const checkGooglePayAvailability = async () => {
            try {
                // Check if Google Pay is supported
                if (window.google && window.google.payments) {
                    setIsGooglePayAvailable(true);
                    
                    // Initialize Google Pay client
                    const client = new window.google.payments.api.PaymentsClient({
                        environment: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'TEST'
                    });
                    
                    setGooglePayClient(client);
                } else {
                    console.log('Google Pay not available');
                    setIsGooglePayAvailable(false);
                }
            } catch (error) {
                console.error('Error checking Google Pay availability:', error);
                setIsGooglePayAvailable(false);
            }
        };

        checkGooglePayAvailability();
    }, []);

    const handleGooglePayPayment = async () => {
        if (!googlePayClient || !isGooglePayAvailable) {
            toast.error('Google Pay is not available');
            return;
        }

        setIsLoading(true);

        try {
            // Get payment configuration from server
            const { data: configResponse } = await axios.get('/api/payment/google-pay/config');
            
            if (!configResponse.success) {
                throw new Error('Failed to get Google Pay configuration');
            }

            const { data: paymentIntentResponse } = await axios.post('/api/payment/google-pay/create-intent', {
                amount,
                orderId
            });

            if (!paymentIntentResponse.success) {
                throw new Error('Failed to create payment intent');
            }

            const { paymentDataRequest } = paymentIntentResponse.data;

            // Use the server-provided payment data request with callbacks
            const paymentDataRequestMessage = {
                ...paymentDataRequest,
                // Ensure callbacks are properly set
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
                            newTransactionInfo: paymentDataRequest.transactionInfo,
                            newTotalPriceStatus: 'FINAL'
                        };
                    }
                }
            };

            console.log('Payment data request:', paymentDataRequestMessage);

            // Load payment data
            const paymentData = await googlePayClient.loadPaymentData(paymentDataRequestMessage);

            console.log('Payment data received:', paymentData);

            // Process payment on server
            const { data: paymentResponse } = await axios.post('/api/payment/google-pay/process', {
                paymentResponse: paymentData,
                orderDetails: {
                    amount,
                    orderId
                }
            });

            if (paymentResponse.success) {
                toast.success('Payment successful!');
                onSuccess && onSuccess(paymentResponse.data);
            } else {
                throw new Error(paymentResponse.message || 'Payment failed');
            }

        } catch (error) {
            console.error('Google Pay payment error:', error);
            
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.message) {
                toast.error(error.message);
            } else {
                toast.error('Payment failed. Please try again.');
            }
            
            onError && onError(error);
        } finally {
            setIsLoading(false);
        }
    };

    // If Google Pay is not available, don't render the button
    if (!isGooglePayAvailable) {
        return null;
    }

    return (
        <button
            onClick={handleGooglePayPayment}
            disabled={disabled || isLoading}
            className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-3 px-4 rounded-md font-medium transition-all flex items-center justify-center gap-2"
        >
            {isLoading ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                </>
            ) : (
                <>
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Pay with Google Pay
                </>
            )}
        </button>
    );
};

export default GooglePayButton;
