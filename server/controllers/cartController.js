


// update user cartData : /api/cart/update

const User = require("../models/User");

const updateCart = async (req, res) => {
    try{
        const { cartItems } = req.body;
        const { userId } = req.user; // Get userId from authenticated user
        
        await User.findByIdAndUpdate(userId, { cartItems });
        res.status(200).json({ success: true, message: "Cart updated successfully" });
    }catch(error){
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = updateCart;