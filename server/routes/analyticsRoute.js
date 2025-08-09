const express = require('express');
const authSeller = require('../middlewares/authSeller');
const { getSellerAnalytics } = require('../controllers/analyticsController');

const analyticsRouter = express.Router();

analyticsRouter.get("/seller", authSeller, getSellerAnalytics);

module.exports = analyticsRouter; 