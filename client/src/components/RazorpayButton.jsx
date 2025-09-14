import React, { useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';

const RazorpayButton = ({ amount, orderId, items, addressId, customer = {}, onSuccess, onError, disabled = false }) => {
    const { axios, toast } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Load Razorpay script
        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                if (window.Razorpay) {
                    resolve(window.Razorpay);
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => resolve(window.Razorpay);
                script.onerror = () => {
                    console.error('Failed to load Razorpay script');
                    resolve(null);
                };
                document.body.appendChild(script);
            });
        };

        loadRazorpayScript();
    }, []);

    const handleRazorpayPayment = async () => {
        // Basic client-side validation to avoid widget errors
        if (!Array.isArray(items) || items.length === 0) {
            toast.error('Cart is empty');
            return;
        }
        if (!addressId) {
            toast.error('Please select an address');
            return;
        }
        setIsLoading(true);

        try {
            // Create Razorpay order on server
            const { data: orderResponse } = await axios.post('/api/order/razorpay', {
                items,
                addressId,
                amount
            }, { withCredentials: true });

            if (!orderResponse.success) {
                throw new Error(orderResponse.message || 'Failed to create payment order');
            }

            // Load Razorpay script if not already loaded
            const Razorpay = await new Promise((resolve) => {
                if (window.Razorpay) {
                    resolve(window.Razorpay);
                } else {
                    const script = document.createElement('script');
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    script.onload = () => resolve(window.Razorpay);
                    document.body.appendChild(script);
                }
            });

            // Configure Razorpay options
            const isMobile = typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);

            const options = {
                key: orderResponse.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
                // Do not pass amount when order_id is present; Razorpay uses order's amount
                currency: orderResponse.currency || 'INR',
                name: customer.storeName || 'Your Store Name',
                description: `Order ${orderId}`,
                order_id: orderResponse.orderId,
                handler: async function (response) {
                    try {
                        // Validate payment response before verification
                        if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
                            throw new Error('Invalid payment response received');
                        }

                        // Verify payment on server
                        const { data: verifyResponse } = await axios.post('/api/order/razorpay/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            items,
                            addressId
                        }, { withCredentials: true });

                        if (verifyResponse.success) {
                            toast.success('Payment successful!');
                            onSuccess && onSuccess(verifyResponse);
                        } else {
                            throw new Error(verifyResponse.message || 'Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        toast.error(error.response?.data?.message || 'Payment verification failed');
                        onError && onError(error);
                    } finally {
                        setIsLoading(false);
                    }
                },
                prefill: {
                    name: customer.name || 'Customer Name',
                    email: customer.email || 'customer@example.com',
                    contact: customer.contact || '9999999999'
                },
                notes: {
                    address: customer.address || 'Customer Address'
                },
                theme: {
                    color: '#3399cc'
                },
                config: {
                    display: {
                        sequence: [
                            'block.upi',
                            'block.cards',
                            'block.netbanking',
                            'block.wallets'
                        ],
                        preferences: {
                            show_default_blocks: true
                        }
                    },
                    upi: {
                        flow: isMobile ? 'intent' : 'collect'
                    }
                },
                modal: {
                    ondismiss: function() {
                        console.log('Payment modal dismissed without payment');
                        toast.error('Payment cancelled');
                        setIsLoading(false);
                    }
                },
                // Add timeout for UPI payments
                timeout: 300000, // 5 minutes timeout
                retry: {
                    enabled: true,
                    max_count: 3
                }
            };

            // Initialize Razorpay payment
            const rzp = new Razorpay(options);

            // Mobile-specific handling for UPI app exits
            let paymentCompleted = false;
            let pageVisibilityTimer = null;

            // Track page visibility changes (mobile UPI app switching)
            const handleVisibilityChange = () => {
                if (document.hidden && !paymentCompleted) {
                    // User switched to UPI app
                    console.log('User switched to UPI app');
                } else if (!document.hidden && !paymentCompleted) {
                    // User returned from UPI app
                    console.log('User returned from UPI app');
                    // Set a timer to check if payment was completed
                    pageVisibilityTimer = setTimeout(() => {
                        if (!paymentCompleted) {
                            console.log('Payment not completed after returning from UPI app');
                            toast.error('Payment cancelled');
                            setIsLoading(false);
                        }
                    }, 3000); // 3 second grace period
                }
            };

            // Add visibility change listener for mobile
            if (isMobile) {
                document.addEventListener('visibilitychange', handleVisibilityChange);
            }

            // Capture explicit failure reasons from Razorpay widget
            rzp.on('payment.failed', function (response) {
                console.error('Razorpay payment.failed:', response);
                paymentCompleted = true;
                const description = response?.error?.description || response?.error?.reason || 'Payment failed. Please try again.';
                toast.error(description);
                onError && onError(response);
                setIsLoading(false);
            });

            // Handle UPI specific errors
            rzp.on('payment.cancelled', function (response) {
                console.log('Payment cancelled by user:', response);
                paymentCompleted = true;
                toast.error('Payment cancelled');
                setIsLoading(false);
            });

            // Override the handler to track completion
            const originalHandler = options.handler;
            options.handler = async function(response) {
                paymentCompleted = true;
                if (pageVisibilityTimer) {
                    clearTimeout(pageVisibilityTimer);
                }
                if (isMobile) {
                    document.removeEventListener('visibilitychange', handleVisibilityChange);
                }
                return originalHandler(response);
            };

            rzp.open();

        } catch (error) {
            console.error('Razorpay payment error:', error);
            
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

    return (
        <button
            onClick={handleRazorpayPayment}
            disabled={disabled || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-md font-medium transition-all flex items-center justify-center gap-2"
        >
            {isLoading ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                </>
            ) : (
                <>
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Pay with Razorpay
                </>
            )}
        </button>
    );
};

export default RazorpayButton;
