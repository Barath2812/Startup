const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Address = require("../models/Address");

// Get seller analytics
const getSellerAnalytics = async (req, res) => {
    try {
        // Get all orders
        const orders = await Order.find({
            $or: [
                { paymentMethod: "COD" },
                { paymentMethod: "Online" },
                { isPaid: true },
            ],
        }).populate("items.productId addressId");

        // Calculate basic metrics
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Get total products
        const totalProducts = await Product.countDocuments();

        // Sales by Category
        const salesByCategory = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const category = item.productId.category;
                if (!salesByCategory[category]) {
                    salesByCategory[category] = 0;
                }
                salesByCategory[category] += item.productId.offerPrice * item.quantity;
            });
        });

        // Sales by Month (last 12 months)
        const salesByMonth = {};
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        // Initialize all months with 0
        months.forEach(month => {
            salesByMonth[month] = 0;
        });

        orders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const month = months[orderDate.getMonth()];
            salesByMonth[month] += order.amount;
        });

        // Sales by City
        const salesByCity = {};
        orders.forEach(order => {
            if (order.addressId) {
                const city = order.addressId.city;
                if (!salesByCity[city]) {
                    salesByCity[city] = 0;
                }
                salesByCity[city] += order.amount;
            }
        });

        // Top Products (by quantity sold)
        const productSales = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const productId = item.productId._id.toString();
                if (!productSales[productId]) {
                    productSales[productId] = {
                        _id: item.productId._id,
                        name: item.productId.name,
                        category: item.productId.category,
                        image: item.productId.image,
                        quantitySold: 0,
                        totalSales: 0
                    };
                }
                productSales[productId].quantitySold += item.quantity;
                productSales[productId].totalSales += item.productId.offerPrice * item.quantity;
            });
        });

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.quantitySold - a.quantitySold)
            .slice(0, 5);

        // Recent Orders (last 10 orders)
        const recentOrders = orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10)
            .map(order => ({
                _id: order._id,
                amount: order.amount,
                status: order.status,
                createdAt: order.createdAt,
                paymentMethod: order.paymentMethod
            }));

        const analytics = {
            totalOrders,
            totalRevenue,
            totalProducts,
            averageOrderValue,
            salesByCategory,
            salesByMonth,
            salesByCity,
            topProducts,
            recentOrders
        };

        res.status(200).json({ success: true, analytics });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ success: false, message: "Failed to fetch analytics" });
    }
};

module.exports = { getSellerAnalytics }; 