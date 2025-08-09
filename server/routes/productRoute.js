const express = require("express");
const upload = require("../configs/multer");
const authSeller = require("../middlewares/authSeller");
const {
  addProduct,
  ProductList,
  ProductById,
  changeStock
} = require("../controllers/productController");

const productRouter = express.Router();

// Upload multiple images with field name "images"
productRouter.post("/add", authSeller, upload.array("images"), addProduct);

// Get all products
productRouter.get("/list", ProductList);

// Get product by ID
productRouter.get("/id/:id", ProductById);

// Change stock
productRouter.post("/stock", authSeller, changeStock);

module.exports = productRouter;
