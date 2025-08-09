const express = require('express');
const authUser = require('../middlewares/authUser');
const { placeOrderCOD, placeOrderOnline, placeOrderStripe, stripeWebhook, getUserOrders, getAllOrders, testEmail } = require('../controllers/orderController');
const authSeller = require('../middlewares/authSeller');

const orderRouter = express.Router();

orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.post("/online", authUser, placeOrderOnline);
orderRouter.post("/stripe", authUser, placeOrderStripe);
// orderRouter.post("/webhook", express.raw({type: 'application/json'}), stripeWebhook);
orderRouter.get("/user", authUser, getUserOrders);
orderRouter.get("/seller", authSeller, getAllOrders);
orderRouter.get("/test-email", testEmail); // Test email endpoint

module.exports = orderRouter;