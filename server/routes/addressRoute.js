

const express = require("express");
const authUser = require("../middlewares/authUser");
const { addAddress, getAddress } = require("../controllers/addressController");

const addressRouter = express.Router();

addressRouter.post("/add", authUser, addAddress);   // ✅ Add new address
addressRouter.get("/get", authUser, getAddress);    // ✅ Get existing addresses

module.exports = addressRouter;
