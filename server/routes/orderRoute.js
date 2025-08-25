const express = require('express');
const authUser = require('../middlewares/authUser');
const { placeOrderCOD, placeOrderOnline, placeOrderRazorpay, verifyRazorpayPayment, getUserOrders, getAllOrders, testEmail } = require('../controllers/orderController');
const authSeller = require('../middlewares/authSeller');

const orderRouter = express.Router();

orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.post("/online", authUser, placeOrderOnline);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);
orderRouter.post("/razorpay/verify", authUser, verifyRazorpayPayment);
orderRouter.get("/user", authUser, getUserOrders);
orderRouter.get("/seller", authSeller, getAllOrders);
orderRouter.get("/test-email", testEmail); // Test email endpoint

module.exports = orderRouter;