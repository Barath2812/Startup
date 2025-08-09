

// Place Order COD : /api/order/cod

const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const Address = require("../models/Address");
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Disabled online payments
const { sendOrderEmails, isEmailConfigured } = require("../utils/emailService");

const placeOrderCOD = async (req, res) => {
    try {
        const { items, addressId } = req.body;
        const { userId } = req.user; // Get userId from authenticated user
        
        if(!addressId || !items || items.length === 0){
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        // Calculate amount
        let totalAmount = 0;
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(400).json({ success: false, message: `Product ${item.productId} not found` });
            }
            totalAmount += product.offerPrice * item.quantity;
        }

        // Add Tax Charge (2%)
        const tax = Math.floor(totalAmount * 0.02);
        const finalAmount = totalAmount + tax;

        const newOrder = await Order.create({
            userId: userId,
            items,
            amount: finalAmount,
            addressId,
            paymentMethod: "COD",
            status: "pending"
        });

        // Send email and WhatsApp notifications
        try {
            const user = await User.findById(userId);
            const address = await Address.findById(addressId);
            const populatedOrder = await Order.findById(newOrder._id).populate("items.productId");
            
            const orderDetails = {
                order: populatedOrder,
                user,
                address
            };

            // Send email notification
            if (isEmailConfigured()) {
                try {
                    await sendOrderEmails(orderDetails);
                } catch (emailError) {
                    console.error('Failed to send order emails:', emailError);
                    // Don't fail the order if email fails
                }
            } else {
                console.log('Email not configured. Order placed without email notification.');
            }


        } catch (notificationError) {
            console.error('Failed to send notifications:', notificationError);
            // Don't fail the order if notifications fail
        }

        res.status(200).json({ success: true, message: "Order placed successfully" });
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Online payment with Google Pay
const placeOrderOnline = async (req, res) => {
    try {
        const { items, addressId, paymentData } = req.body;
        const { userId } = req.user;
        
        if(!addressId || !items || items.length === 0){
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        if (!paymentData) {
            return res.status(400).json({ success: false, message: "Payment data is required" });
        }

        // Calculate amount
        let totalAmount = 0;
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(400).json({ success: false, message: `Product ${item.productId} not found` });
            }
            totalAmount += product.offerPrice * item.quantity;
        }

        // Add Tax Charge (2%)
        const tax = Math.floor(totalAmount * 0.02);
        const finalAmount = totalAmount + tax;

        // Process Google Pay payment
        const { processGooglePayPayment, validatePaymentResponse } = require('../utils/googlePayService');
        
        // Validate payment response
        const validation = validatePaymentResponse(paymentData);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment response',
                error: validation.error
            });
        }

        // Process the payment
        const paymentResult = await processGooglePayPayment(validation.paymentData, {
            amount: finalAmount,
            orderId: `order_${Date.now()}`
        });

        if (!paymentResult.success) {
            return res.status(400).json({
                success: false,
                message: 'Payment processing failed'
            });
        }

        // Create order with payment details
        const newOrder = await Order.create({
            userId: userId,
            items,
            amount: finalAmount,
            addressId,
            paymentMethod: "Online",
            paymentDetails: {
                transactionId: paymentResult.transactionId,
                paymentMethod: "Google Pay",
                status: paymentResult.status,
                timestamp: paymentResult.timestamp
            },
            status: "confirmed",
            isPaid: true
        });

        // Send email and WhatsApp notifications
        try {
            const user = await User.findById(userId);
            const address = await Address.findById(addressId);
            const populatedOrder = await Order.findById(newOrder._id).populate("items.productId");
            
            const orderDetails = {
                order: populatedOrder,
                user,
                address
            };

            // Send email notification
            if (isEmailConfigured()) {
                try {
                    await sendOrderEmails(orderDetails);
                } catch (emailError) {
                    console.error('Failed to send order emails:', emailError);
                }
            } else {
                console.log('Email not configured. Order placed without email notification.');
            }


        } catch (notificationError) {
            console.error('Failed to send notifications:', notificationError);
        }

        res.status(200).json({ 
            success: true, 
            message: "Order placed successfully",
            paymentResult
        });
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Updated Stripe function to use Google Pay
const placeOrderStripe = async (req, res) => {
    // Redirect to Google Pay implementation
    return await placeOrderOnline(req, res);
}

// Stripe webhook disabled - online payments disabled
const stripeWebhook = async (req, res) => {
    return res.status(400).json({ 
        success: false, 
        message: "Online payments are currently disabled. Webhook processing is not available." 
    });
}

// Get Orders by userId : /api/order/user

const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.user; // Get userId from authenticated user
        const orders = await Order.find({ 
            userId,
            $or: [
                { paymentMethod: "COD" },
                { paymentMethod: "Online" },
                { isPaid: true },
            ],
        }).populate("items.productId addressId").sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });

    }catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}


// Get All Orders (for seller / admin) : /api/order/seller

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [
                { paymentMethod: "COD" },
                { paymentMethod: "Online" },
                { isPaid: true },
            ],
        }).populate("items.productId addressId").sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });       
    }
}


// Test email functionality
const testEmail = async (req, res) => {
    try {
        if (!isEmailConfigured()) {
            return res.status(400).json({ 
                success: false, 
                message: "Email not configured. Please set EMAIL_USER and EMAIL_PASSWORD in your .env file" 
            });
        }

        const testOrderDetails = {
            order: {
                _id: 'test-order-123',
                createdAt: new Date(),
                paymentMethod: 'COD',
                status: 'pending',
                amount: 1500,
                items: [
                    {
                        productId: {
                            name: 'Test Product',
                            category: 'Electronics',
                            offerPrice: 1500,
                            image: ['https://via.placeholder.com/150']
                        },
                        quantity: 1
                    }
                ]
            },
            user: {
                name: 'Test User',
                email: 'test@example.com'
            },
            address: {
                firstname: 'Test',
                lastname: 'User',
                street: '123 Test Street',
                city: 'Test City',
                state: 'Test State',
                pincode: '123456',
                country: 'Test Country',
                phone: '1234567890'
            }
        };

        await sendOrderEmail(testOrderDetails);
        res.status(200).json({ success: true, message: "Test email sent successfully" });
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({ success: false, message: "Failed to send test email" });
    }
};

module.exports = {placeOrderCOD, placeOrderOnline, placeOrderStripe, stripeWebhook, getUserOrders, getAllOrders, testEmail};