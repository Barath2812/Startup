const nodemailer = require('nodemailer');

// Check if email credentials are configured
const isEmailConfigured = () => {
    return process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;
};

// Create transporter with fallback options
const createTransporter = () => {
    // If SendGrid is configured, use it
    if (process.env.SENDGRID_API_KEY) {
        return nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            secure: false,
            auth: {
                user: 'apikey',
                pass: process.env.SENDGRID_API_KEY
            }
        });
    }
    
    // Default to Gmail
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

const transporter = createTransporter();

// Send order confirmation email to customer
const sendCustomerOrderEmail = async (orderDetails) => {
    try {
        // Check if email is configured
        if (!isEmailConfigured()) {
            console.log('Email not configured. Skipping customer email notification.');
            return;
        }

        const { order, user, address } = orderDetails;
        
        // Format order items
        const itemsList = order.items.map(item => {
            const product = item.productId;
            return `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">
                        <img src="${product.image[0]}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                    </td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${product.name}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${product.category}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${product.offerPrice}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${product.offerPrice * item.quantity}</td>
                </tr>
            `;
        }).join('');

        const emailHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Order Confirmation</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9f9f9; padding: 20px; }
                    .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
                    .customer-info { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
                    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .items-table th { background: #f5f5f5; padding: 12px; text-align: left; }
                    .items-table td { padding: 10px; border-bottom: 1px solid #eee; }
                    .total { background: #28a745; color: white; padding: 15px; border-radius: 8px; text-align: right; font-weight: bold; }
                    .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }
                    .status.pending { background: #fff3cd; color: #856404; }
                    .status.confirmed { background: #d4edda; color: #155724; }
                    .footer { text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Order Confirmed!</h1>
                        <p>Thank you for your order</p>
                    </div>
                    
                    <div class="content">
                        <div class="order-details">
                            <h2>📋 Order Details</h2>
                            <p><strong>Order ID:</strong> ${order._id}</p>
                            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                            <p><strong>Status:</strong> <span class="status ${order.status}">${order.status}</span></p>
                            <p><strong>Total Amount:</strong> ₹${order.amount}</p>
                        </div>

                        <div class="customer-info">
                            <h2>📦 Delivery Address</h2>
                            <p style="margin-left: 20px;">
                                ${address.firstname} ${address.lastname}<br>
                                ${address.street}<br>
                                ${address.city}, ${address.state} ${address.pincode}<br>
                                ${address.country}<br>
                                Phone: ${address.phone}
                            </p>
                        </div>

                        <div class="order-details">
                            <h2>🛍️ Your Order Items</h2>
                            <table class="items-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsList}
                                </tbody>
                            </table>
                            
                            <div class="total">
                                <h3>Total Amount: ₹${order.amount}</h3>
                            </div>
                        </div>

                        <div class="footer">
                            <p><strong>What's Next?</strong></p>
                            <p>We'll keep you updated on your order status. You can track your order in your account dashboard.</p>
                            <p>If you have any questions, please contact our support team.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `Order Confirmation - #${order._id}`,
            html: emailHTML
        };

        await transporter.sendMail(mailOptions);
        console.log('Customer order confirmation email sent successfully');
        
    } catch (error) {
        console.error('Error sending customer order email:', error);
        // Don't throw error to prevent order failure
        console.log('Customer email sending failed, but order was placed successfully');
    }
};

// Send new order notification email to seller
const sendSellerOrderEmail = async (orderDetails) => {
    try {
        // Check if email is configured
        if (!isEmailConfigured()) {
            console.log('Email not configured. Skipping seller email notification.');
            return;
        }

        const { order, user, address } = orderDetails;
        
        // Format order items
        const itemsList = order.items.map(item => {
            const product = item.productId;
            return `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">
                        <img src="${product.image[0]}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                    </td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${product.name}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${product.category}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${product.offerPrice}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${product.offerPrice * item.quantity}</td>
                </tr>
            `;
        }).join('');

        const emailHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>New Order Received</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #615fff; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9f9f9; padding: 20px; }
                    .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
                    .customer-info { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
                    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .items-table th { background: #f5f5f5; padding: 12px; text-align: left; }
                    .items-table td { padding: 10px; border-bottom: 1px solid #eee; }
                    .total { background: #615fff; color: white; padding: 15px; border-radius: 8px; text-align: right; font-weight: bold; }
                    .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }
                    .status.pending { background: #fff3cd; color: #856404; }
                    .status.confirmed { background: #d4edda; color: #155724; }
                    .action-button { display: inline-block; background: #615fff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🛍️ New Order Received</h1>
                        <p>Order #${order._id}</p>
                    </div>
                    
                    <div class="content">
                        <div class="order-details">
                            <h2>📋 Order Details</h2>
                            <p><strong>Order ID:</strong> ${order._id}</p>
                            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                            <p><strong>Status:</strong> <span class="status ${order.status}">${order.status}</span></p>
                            <p><strong>Total Amount:</strong> ₹${order.amount}</p>
                        </div>

                        <div class="customer-info">
                            <h2>👤 Customer Information</h2>
                            <p><strong>Name:</strong> ${user.name}</p>
                            <p><strong>Email:</strong> ${user.email}</p>
                            <p><strong>Phone:</strong> ${address.phone}</p>
                            <p><strong>Address:</strong></p>
                            <p style="margin-left: 20px;">
                                ${address.firstname} ${address.lastname}<br>
                                ${address.street}<br>
                                ${address.city}, ${address.state} ${address.pincode}<br>
                                ${address.country}
                            </p>
                        </div>

                        <div class="order-details">
                            <h2>📦 Order Items</h2>
                            <table class="items-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsList}
                                </tbody>
                            </table>
                            
                            <div class="total">
                                <h3>Total Amount: ₹${order.amount}</h3>
                            </div>
                        </div>

                        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                            <p><strong>Order placed on:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                            <p>Please process this order and update the status accordingly.</p>
                            <a href="#" class="action-button">View Order Details</a>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.SELLER_EMAIL || 'pramoothsaionraise@gmail.com', // Use environment variable or fallback
            subject: `New Order Received - #${order._id}`,
            html: emailHTML
        };

        await transporter.sendMail(mailOptions);
        console.log('Seller order notification email sent successfully');
        
    } catch (error) {
        console.error('Error sending seller order email:', error);
        // Don't throw error to prevent order failure
        console.log('Seller email sending failed, but order was placed successfully');
    }
};

// Send both customer and seller emails
const sendOrderEmails = async (orderDetails) => {
    try {
        // Send customer confirmation email
        await sendCustomerOrderEmail(orderDetails);
        
        // Send seller notification email
        await sendSellerOrderEmail(orderDetails);
        
        console.log('Both customer and seller emails sent successfully');
    } catch (error) {
        console.error('Error sending order emails:', error);
        // Don't throw error to prevent order failure
        console.log('Email sending failed, but order was placed successfully');
    }
};

// Legacy function for backward compatibility
const sendOrderEmail = async (orderDetails) => {
    await sendOrderEmails(orderDetails);
};

module.exports = { 
    sendOrderEmail, 
    sendCustomerOrderEmail, 
    sendSellerOrderEmail, 
    sendOrderEmails, 
    isEmailConfigured 
}; 