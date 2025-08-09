const axios = require('axios');

// Check if WhatsApp is configured
const isWhatsAppConfigured = () => {
    return process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID;
};

// Send WhatsApp message using WhatsApp Business API
const sendWhatsAppMessage = async (phoneNumber, message) => {
    try {
        if (!isWhatsAppConfigured()) {
            console.log('WhatsApp not configured. Skipping WhatsApp notification.');
            return;
        }

        // Format phone number (remove + and add country code if needed)
        let formattedPhone = phoneNumber.replace(/\D/g, '');
        if (!formattedPhone.startsWith('91')) {
            formattedPhone = '91' + formattedPhone;
        }

        const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
        
        const payload = {
            messaging_product: "whatsapp",
            to: formattedPhone,
            type: "text",
            text: {
                body: message
            }
        };

        const response = await axios.post(url, payload, {
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('WhatsApp message sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending WhatsApp message:', error.response?.data || error.message);
        throw error;
    }
};

// Send order confirmation WhatsApp to customer
const sendCustomerOrderWhatsApp = async (orderDetails) => {
    try {
        const { order, user, address } = orderDetails;
        
        // Format order items
        const itemsList = order.items.map(item => {
            const product = item.productId;
            return `• ${product.name} (${product.category}) - ₹${product.offerPrice} x ${item.quantity} = ₹${product.offerPrice * item.quantity}`;
        }).join('\n');

        const message = `🎉 *Order Confirmed!*

📋 *Order Details:*
Order ID: ${order._id}
Date: ${new Date(order.createdAt).toLocaleString()}
Payment: ${order.paymentMethod}
Status: ${order.status}
Total: ₹${order.amount}

📦 *Delivery Address:*
${address.firstname} ${address.lastname}
${address.street}
${address.city}, ${address.state} ${address.pincode}
${address.country}
Phone: ${address.phone}

🛍️ *Your Order Items:*
${itemsList}

💰 *Total Amount: ₹${order.amount}*

We'll keep you updated on your order status. Track your order in your account dashboard.

Thank you for choosing RootCare! 🌿`;

        await sendWhatsAppMessage(address.phone, message);
        console.log('Customer order confirmation WhatsApp sent successfully');
        
    } catch (error) {
        console.error('Error sending customer order WhatsApp:', error);
        console.log('Customer WhatsApp sending failed, but order was placed successfully');
    }
};

// Send new order notification WhatsApp to seller
const sendSellerOrderWhatsApp = async (orderDetails) => {
    try {
        const { order, user, address } = orderDetails;
        
        // Format order items
        const itemsList = order.items.map(item => {
            const product = item.productId;
            return `• ${product.name} (${product.category}) - ₹${product.offerPrice} x ${item.quantity} = ₹${product.offerPrice * item.quantity}`;
        }).join('\n');

        const message = `🛍️ *New Order Received!*

📋 *Order Details:*
Order ID: ${order._id}
Date: ${new Date(order.createdAt).toLocaleString()}
Payment: ${order.paymentMethod}
Status: ${order.status}
Total: ₹${order.amount}

👤 *Customer Information:*
Name: ${user.name}
Email: ${user.email}
Phone: ${address.phone}

📦 *Delivery Address:*
${address.firstname} ${address.lastname}
${address.street}
${address.city}, ${address.state} ${address.pincode}
${address.country}

🛍️ *Order Items:*
${itemsList}

💰 *Total Amount: ₹${order.amount}*

Please process this order and update the status accordingly.`;

        // Send to seller's WhatsApp number
        const sellerPhone = process.env.SELLER_WHATSAPP || '919876543210'; // Default seller number
        await sendWhatsAppMessage(sellerPhone, message);
        console.log('Seller order notification WhatsApp sent successfully');
        
    } catch (error) {
        console.error('Error sending seller order WhatsApp:', error);
        console.log('Seller WhatsApp sending failed, but order was placed successfully');
    }
};

// Send both customer and seller WhatsApp messages
const sendOrderWhatsApp = async (orderDetails) => {
    try {
        // Send customer confirmation WhatsApp
        await sendCustomerOrderWhatsApp(orderDetails);
        
        // Send seller notification WhatsApp
        await sendSellerOrderWhatsApp(orderDetails);
        
        console.log('Both customer and seller WhatsApp messages sent successfully');
    } catch (error) {
        console.error('Error sending order WhatsApp messages:', error);
        console.log('WhatsApp sending failed, but order was placed successfully');
    }
};

// Send simple WhatsApp message
const sendSimpleWhatsApp = async (phoneNumber, message) => {
    try {
        await sendWhatsAppMessage(phoneNumber, message);
        console.log('Simple WhatsApp message sent successfully');
    } catch (error) {
        console.error('Error sending simple WhatsApp message:', error);
        throw error;
    }
};

module.exports = {
    sendWhatsAppMessage,
    sendCustomerOrderWhatsApp,
    sendSellerOrderWhatsApp,
    sendOrderWhatsApp,
    sendSimpleWhatsApp,
    isWhatsAppConfigured
};
