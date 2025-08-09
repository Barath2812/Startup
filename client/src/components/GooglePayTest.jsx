import React, { useState, useEffect } from 'react';
import GooglePayButton from './GooglePayButton';

const GooglePayTest = () => {
  const [isGooglePayAvailable, setIsGooglePayAvailable] = useState(false);

  useEffect(() => {
    // Check if Google Pay is available
    const checkGooglePay = () => {
      if (window.google && window.google.payments) {
        setIsGooglePayAvailable(true);
        console.log('✅ Google Pay is available');
      } else {
        console.log('❌ Google Pay is not available');
        setIsGooglePayAvailable(false);
      }
    };

    // Check immediately
    checkGooglePay();

    // Check again after a delay to ensure script is loaded
    const timer = setTimeout(checkGooglePay, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    alert('Payment successful! Check console for details.');
  };

  const handleError = (error) => {
    console.error('Payment failed:', error);
    alert('Payment failed! Check console for details.');
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-8 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Google Pay Test</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Status: {isGooglePayAvailable ? '✅ Available' : '❌ Not Available'}
        </p>
      </div>

      {isGooglePayAvailable ? (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Test Google Pay with a ₹100 payment
          </p>
          <GooglePayButton
            amount="100.00"
            orderId={`test_${Date.now()}`}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">
            Google Pay is not available in your browser.
          </p>
          <p className="text-xs text-gray-400">
            Make sure you're using Chrome and have Google Pay set up.
          </p>
        </div>
      )}
    </div>
  );
};

export default GooglePayTest;
