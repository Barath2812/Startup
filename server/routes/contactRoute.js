const express = require('express');
const { submitContact, getAllContacts, updateContactStatus } = require('../controllers/contactController');
const authSeller = require('../middlewares/authSeller');

const contactRouter = express.Router();

// Public route for submitting contact form
contactRouter.post("/submit", submitContact);

// Protected routes for admin/seller (require authentication)
contactRouter.get("/all", authSeller, getAllContacts);
contactRouter.put("/status/:contactId", authSeller, updateContactStatus);

module.exports = contactRouter; 