# 🛍️ E-Commerce Startup Platform

A full-stack e-commerce platform built with React.js, Node.js, and MongoDB. This project features a modern, responsive design with both customer and seller interfaces, complete with payment integration, order management, and real-time analytics.

## 🌟 Features

### Customer Features
- **User Authentication**: Secure login/register system with JWT tokens
- **Product Browsing**: Browse products by categories with search functionality
- **Product Details**: Detailed product pages with images, descriptions, and pricing
- **Shopping Cart**: Add/remove items with quantity management
- **Order Management**: Place orders with multiple payment options
- **Address Management**: Save and manage delivery addresses
- **Order Tracking**: View order history and status
- **Contact Support**: Contact form for customer support

### Seller Features
- **Seller Dashboard**: Analytics and overview of business performance
- **Product Management**: Add, edit, and manage product inventory
- **Order Management**: View and process customer orders
- **Stock Management**: Update product availability
- **Sales Analytics**: Track sales performance and trends

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live cart updates and order status
- **Payment Integration**: Multiple payment methods (COD, Online, Stripe)
- **Image Upload**: Cloudinary integration for product images
- **Email Notifications**: Automated email service for orders
- **Search Functionality**: Product search with filtering
- **Security**: JWT authentication, password hashing, CORS protection

## 🏗️ Tech Stack

### Frontend
- **React.js 19** - Modern React with hooks and context
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Toast notifications
- **Chart.js** - Data visualization for analytics
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud image storage
- **Nodemailer** - Email service
- **Stripe** - Payment processing
- **CORS** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Startup
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (root, server, and client)
   npm run install:all
   
   # Or install separately:
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**

   Create `.env` files in both `server` and `client` directories:

   **Server (.env)**
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

   **Client (.env)**
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   VITE_CURRENCY=₹
   ```

4. **Start the application**
   ```bash
   # Start both frontend and backend (from root directory)
   npm run dev
   
   # Or start separately:
   # Start the server (from server directory)
   npm run server
   
   # Start the client (from client directory)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🚀 Vercel Deployment

### Quick Deployment

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (root of your project)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm run install:all`

3. **Environment Variables**:
   Add all required environment variables in Vercel dashboard (see `DEPLOYMENT.md` for full list)

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

### Detailed Deployment Guide

For comprehensive deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📁 Project Structure

```
Startup/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── assets/        # Images and assets
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                # Node.js backend
│   ├── configs/          # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middlewares/      # Custom middlewares
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── package.json
│   └── server.js         # Entry point
├── vercel.json           # Vercel configuration
├── package.json          # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/logout` - User logout
- `GET /api/user/is-auth` - Check user authentication

### Products
- `GET /api/product/list` - Get all products
- `GET /api/product/id/:id` - Get product by ID
- `POST /api/product/add` - Add new product (seller only)
- `POST /api/product/stock` - Update product stock (seller only)

### Orders
- `POST /api/order/cod` - Place COD order
- `POST /api/order/online` - Place online order
- `POST /api/order/stripe` - Place Stripe order
- `GET /api/order/user` - Get user orders
- `GET /api/order/seller` - Get all orders (seller only)

### Cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove item from cart
- `GET /api/cart` - Get cart items

### Address
- `POST /api/address/add` - Add new address
- `GET /api/address` - Get user addresses
- `DELETE /api/address/:id` - Delete address

## 🎨 Key Components

### Frontend Components
- **Navbar**: Navigation with search and cart
- **ProductCard**: Product display component
- **Cart**: Shopping cart management
- **Login**: Authentication forms
- **SellerLayout**: Seller dashboard layout
- **Dashboard**: Analytics and overview

### Backend Controllers
- **userController**: User authentication and management
- **productController**: Product CRUD operations
- **orderController**: Order processing and management
- **cartController**: Shopping cart operations
- **analyticsController**: Business analytics

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- Secure file uploads
- Environment variable protection

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy the server directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- MongoDB for the flexible database
- All contributors and supporters

## 📞 Support

For support, email support@yourstartup.com or create an issue in the repository.

---

**Happy Coding! 🎉** 
