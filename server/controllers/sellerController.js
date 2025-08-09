const jwt = require("jsonwebtoken");

// Seller Login
const sellerLogin = async (req, res) => {
  const { email, password } = req.body;

  if (email === process.env.SELLER_EMAIL && password === process.env.SELLER_PASSWORD) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("sellerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ success: true, message: "Seller logged in successfully" });
  }

  return res.status(400).json({ success: false, message: "Invalid credentials" });
};

// Check Seller Auth
const isSellerAuth = async (req, res) => {
  return res.status(200).json({ success: true, message: "Seller is authenticated" });
};

// Logout Seller
const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.status(200).json({ success: true, message: "Seller logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

module.exports = { sellerLogin, isSellerAuth, sellerLogout };
