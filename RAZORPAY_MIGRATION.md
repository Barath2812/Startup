# Stripe to Razorpay Migration Guide

## Overview
This document outlines the complete migration from Stripe to Razorpay payment gateway in the e-commerce application.

## Changes Made

### 1. Server-side Changes

#### Dependencies
- **Removed**: `stripe` package
- **Added**: `razorpay` package

#### New Files Created
- `server/utils/razorpayService.js` - Razorpay service utility
- `server/test-razorpay.js` - Integration test file

#### Modified Files

##### `server/package.json`
```diff
- "stripe": "^18.4.0"
+ "razorpay": "^2.9.2"
```

##### `server/controllers/orderController.js`
- Replaced Stripe imports with Razorpay imports
- Replaced `placeOrderStripe` function with `placeOrderRazorpay`
- Added `verifyRazorpayPayment` function
- Removed `stripeWebhook` function
- Updated module exports

##### `server/routes/orderRoute.js`
```diff
- orderRouter.post("/stripe", authUser, placeOrderStripe);
- // orderRouter.post("/webhook", express.raw({type: 'application/json'}), stripeWebhook);
+ orderRouter.post("/razorpay", authUser, placeOrderRazorpay);
+ orderRouter.post("/razorpay/verify", authUser, verifyRazorpayPayment);
```

##### `server/utils/googlePayService.js`
- Updated Google Pay configuration to use Razorpay instead of Stripe
- Changed gateway references from 'stripe' to 'razorpay'
- Updated environment variable references

#### Environment Variables
```diff
- STRIPE_SECRET_KEY=your_stripe_secret_key
- STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
- STRIPE_ACCOUNT_ID=acct_your_stripe_account_id
+ RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
+ RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 2. Client-side Changes

#### New Files Created
- `client/src/components/RazorpayButton.jsx` - Razorpay payment button component

#### Features of RazorpayButton Component
- Dynamic script loading for Razorpay checkout
- Server-side order creation
- Client-side payment processing
- Payment verification
- Error handling and user feedback
- Loading states and disabled states

### 3. Documentation Updates

#### Updated Files
- `README.md` - Updated payment method references
- `DEPLOYMENT.md` - Updated environment variables and configuration
- `server/README.md` - Updated setup instructions
- `server/env.example` - Updated environment variables

## New API Endpoints

### Razorpay Endpoints
- `POST /api/order/razorpay` - Create Razorpay order
- `POST /api/order/razorpay/verify` - Verify Razorpay payment

### Removed Endpoints
- `POST /api/order/stripe` - Stripe order creation
- `POST /api/order/webhook` - Stripe webhook handler

## Razorpay Service Functions

### `createOrder(amount, currency, receipt)`
- Creates a Razorpay order
- Returns order details with ID
- Handles errors gracefully

### `verifyPaymentSignature(orderId, paymentId, signature)`
- Verifies payment signature for security
- Uses HMAC SHA256 for verification
- Returns boolean result

### `getPaymentDetails(paymentId)`
- Fetches payment details from Razorpay
- Returns complete payment information

### `refundPayment(paymentId, amount, reason)`
- Processes refunds through Razorpay
- Supports partial and full refunds

## Setup Instructions

### 1. Get Razorpay Credentials
1. Create account at [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to Settings → API Keys
3. Generate new API keys
4. Copy Key ID and Key Secret

### 2. Environment Configuration
Add to your `.env` file:
```env
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

### 3. Client Configuration
For production, set the Razorpay key in your client environment:
```env
REACT_APP_RAZORPAY_KEY_ID=rzp_live_your_key_id_here
```

### 4. Test the Integration
Run the test file to verify setup:
```bash
cd server
node test-razorpay.js
```

## Payment Flow

### 1. Order Creation
1. Client calls `/api/order/razorpay` with order details
2. Server creates Razorpay order
3. Returns order ID and amount to client

### 2. Payment Processing
1. Client initializes Razorpay checkout
2. User completes payment on Razorpay
3. Razorpay returns payment response

### 3. Payment Verification
1. Client calls `/api/order/razorpay/verify` with payment details
2. Server verifies payment signature
3. Server creates order in database
4. Returns success response

## Security Features

### Signature Verification
- All payments are verified using HMAC SHA256
- Prevents payment tampering
- Ensures payment authenticity

### Error Handling
- Comprehensive error handling at all levels
- User-friendly error messages
- Detailed logging for debugging

## Benefits of Razorpay

### 1. Indian Market Focus
- Optimized for Indian payment methods
- Support for UPI, cards, net banking
- Better success rates in India

### 2. Cost Effective
- Lower transaction fees
- No setup or monthly fees
- Competitive pricing

### 3. Developer Friendly
- Simple API integration
- Comprehensive documentation
- Good developer support

### 4. Feature Rich
- Multiple payment methods
- Subscription support
- Advanced analytics
- Webhook support

## Testing

### Test Mode
- Use test keys for development
- Test with Razorpay test cards
- Verify all payment flows

### Production Mode
- Switch to live keys
- Update client configuration
- Monitor payment success rates

## Migration Checklist

- [x] Remove Stripe dependencies
- [x] Install Razorpay package
- [x] Create Razorpay service utility
- [x] Update order controller
- [x] Update routes
- [x] Create client-side component
- [x] Update environment variables
- [x] Update documentation
- [x] Test integration
- [x] Update Google Pay service

## Next Steps

1. **Get Razorpay Account**: Sign up at Razorpay and get API keys
2. **Configure Environment**: Add keys to your `.env` file
3. **Test Integration**: Run the test file to verify setup
4. **Update Client**: Replace Google Pay button with Razorpay button where needed
5. **Monitor Payments**: Track payment success rates and errors
6. **Go Live**: Switch to production keys when ready

## Support

For Razorpay integration issues:
- Check [Razorpay Documentation](https://razorpay.com/docs/)
- Review error logs in server console
- Test with Razorpay test cards first
- Contact Razorpay support if needed

## Rollback Plan

If needed, you can rollback to Stripe by:
1. Reverting all code changes
2. Reinstalling Stripe package
3. Restoring Stripe environment variables
4. Updating documentation back to Stripe references
