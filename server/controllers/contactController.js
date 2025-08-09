const Contact = require("../models/Contact");

// Submit contact form
const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                message: "Please fill in all fields" 
            });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: "Please enter a valid email address" 
            });
        }

        // Create contact entry
        await Contact.create({
            name,
            email,
            subject,
            message,
            status: "new"
        });

        res.status(200).json({ 
            success: true, 
            message: "Message sent successfully! We'll get back to you soon." 
        });
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ 
            success: false, 
            message: "Failed to send message. Please try again." 
        });
    }
};

// Get all contact messages (for admin/seller)
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, contacts });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch contact messages." 
        });
    }
};

// Update contact status (mark as read/replied)
const updateContactStatus = async (req, res) => {
    try {
        const { contactId } = req.params;
        const { status } = req.body;
        
        const contact = await Contact.findByIdAndUpdate(
            contactId,
            { status },
            { new: true }
        );
        
        if (!contact) {
            return res.status(404).json({ 
                success: false, 
                message: "Contact message not found" 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: "Contact status updated successfully",
            contact 
        });
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ 
            success: false, 
            message: "Failed to update contact status." 
        });
    }
};

module.exports = { submitContact, getAllContacts, updateContactStatus }; 