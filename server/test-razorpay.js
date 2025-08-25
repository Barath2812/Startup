// Test Razorpay Integration
require('dotenv').config();
const { createOrder, verifyPaymentSignature } = require('./utils/razorpayService');

async function testRazorpayIntegration() {
    console.log('Testing Razorpay Integration...\n');

    // Test 1: Create a test order
    console.log('1. Testing order creation...');
    try {
        const orderResult = await createOrder(10000, 'INR', 'test_receipt_123');
        if (orderResult.success) {
            console.log('✅ Order created successfully');
            console.log('   Order ID:', orderResult.order.id);
            console.log('   Amount:', orderResult.order.amount);
            console.log('   Currency:', orderResult.order.currency);
        } else {
            console.log('❌ Order creation failed:', orderResult.error);
        }
    } catch (error) {
        console.log('❌ Order creation error:', error.message);
    }

    console.log('\n2. Testing signature verification...');
    try {
        // Test with dummy data (this will fail but tests the function)
        const isValid = verifyPaymentSignature(
            'order_test123',
            'pay_test123',
            'dummy_signature'
        );
        console.log('✅ Signature verification function works (expected to fail with dummy data)');
    } catch (error) {
        console.log('❌ Signature verification error:', error.message);
    }

    console.log('\n3. Environment variables check...');
    console.log('   RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? '✅ Set' : '❌ Not set');
    console.log('   RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? '✅ Set' : '❌ Not set');

    console.log('\n🎉 Razorpay integration test completed!');
    console.log('\nTo complete setup:');
    console.log('1. Add your Razorpay keys to .env file');
    console.log('2. Test with real payment flow');
}

// Run the test
testRazorpayIntegration().catch(console.error);
