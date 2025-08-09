const Address = require("../models/Address");


const addAddress = async (req, res) => {
    try {
        const { address } = req.body;
        const { userId } = req.user; // Get userId from authenticated user
        
        await Address.create({ ...address, userId });
        res.status(200).json({ success: true, message: "Address added successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

//get address :/api/address/get

const getAddress = async (req, res) => {
    try {
        const { userId } = req.user; // Get userId from authenticated user
        const addresses = await Address.find({ userId });
        res.status(200).json({ success: true, addresses });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {addAddress , getAddress};    