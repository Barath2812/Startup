const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: "user"
    },
    items: [{
        productId: {
            type: String,
            required: true,
            ref: "product"
        },
        quantity: {
            type: Number,
            required: true,
        }
    }],
    amount: {
        type: Number,
        required: true,
    },
    addressId: {
        type: String,
        required: true,
        ref: "address",
    },
    status: {
        type: String,
        default: "Order Placed",
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    
},{ timestamps: true });

const Order = mongoose.models.order || mongoose.model("order", orderSchema);

module.exports = Order;