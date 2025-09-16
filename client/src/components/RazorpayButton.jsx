import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RazorpayButton = ({ amount, customer = {}, onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  // Use an environment variable for the API base URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    // load Razorpay script once
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // 1️⃣ create order on backend
      const { data: order } = await axios.post(`${API_BASE_URL}/api/razorpay/create-order`, {
        amount,
      });

      if (!order.success) throw new Error('Failed to create order');

      // 2️⃣ setup Razorpay options
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: customer.name || 'Your Store',
        description: 'Test Transaction',
        order_id: order.orderId,
        prefill: {
          name: customer.name || 'Customer',
          email: customer.email || 'customer@example.com',
          contact: customer.contact || '9999999999',
        },
        theme: { color: '#3399cc' },
        handler: async function (response) {
          try {
            // 3️⃣ verify payment on backend
            const verifyRes = await axios.post(`${API_BASE_URL}/api/razorpay/verify-payment`, response);

            if (verifyRes.data.success) {
              alert('✅ Payment successful!');
              onSuccess && onSuccess(verifyRes.data);
            } else {
              throw new Error(verifyRes.data.message);
            }
          } catch (err) {
            console.error('Verification failed:', err);
            alert('❌ Verification failed');
            onError && onError(err);
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            alert('Payment cancelled');
          },
        },
        config: {
          display: {
            sequence: ['block.upi', 'block.cards', 'block.netbanking', 'block.wallets'],
          },
          upi: {
            flow: /Mobi|Android/i.test(navigator.userAgent) ? 'intent' : 'collect',
          },
        },
      };

      // 4️⃣ open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on('payment.failed', (resp) => {
        console.error('Payment failed:', resp.error);
        alert(resp.error.description || 'Payment failed');
        setIsLoading(false);
        onError && onError(resp);
      });
    } catch (err) {
      console.error('Payment error:', err);
      alert(err.message || 'Payment failed');
      onError && onError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-md font-medium transition-all"
    >
      {isLoading ? 'Processing…' : 'Pay with Razorpay'}
    </button>
  );
};

export default RazorpayButton;
