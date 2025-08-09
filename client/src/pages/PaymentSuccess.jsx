import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast, setCartItems } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // Clear cart after successful payment
      setCartItems({});
      toast.success('Payment successful! Your order has been placed.');
      
      // Redirect to orders page after a short delay
      setTimeout(() => {
        navigate('/my-orders');
      }, 2000);
    } else {
      toast.error('Invalid payment session');
      navigate('/cart');
    }
    
    setLoading(false);
  }, [searchParams, navigate, toast, setCartItems]);

  if (loading) {
    return (
      <div className="mt-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing your payment...</p>
      </div>
    );
  }

  return (
    <div className="mt-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your order has been placed successfully.</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">Redirecting to your orders...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
        </div>
        
        <button
          onClick={() => navigate('/my-orders')}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dull transition"
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess; 