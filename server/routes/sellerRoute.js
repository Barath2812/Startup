const express = require('express');
const { sellerLogin, isSellerAuth, sellerLogout } = require('../controllers/sellerController');
const authSeller = require('../middlewares/authSeller');

const sellerRouter = express.Router();

sellerRouter.post('/login', sellerLogin);
sellerRouter.get('/is-auth', authSeller, isSellerAuth);
sellerRouter.post('/logout', authSeller, sellerLogout);

module.exports = sellerRouter;
