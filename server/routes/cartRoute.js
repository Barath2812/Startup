
const express = require("express");         // ✅ Import express
const authUser = require("../middlewares/authUser");
const updateCart = require("../controllers/cartController");

const cartRouter = express.Router();        // ✅ Use express.Router()

cartRouter.post("/update", authUser, updateCart);

module.exports = cartRouter;                // ✅ Export the router
