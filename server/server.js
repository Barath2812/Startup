require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Route Imports
const userRoutes = require('./routes/userRoute');
const sellerRoutes = require('./routes/sellerRoute');
const productRoutes = require('./routes/productRoute');
const cartRoutes = require('./routes/cartRoute');
const orderRoutes = require('./routes/orderRoute');
const addressRoutes = require('./routes/addressRoute');
const contactRoutes = require('./routes/contactRoute');
const analyticsRoutes = require('./routes/analyticsRoute');
const paymentRoutes = require('./routes/paymentRoute');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database and cloudinary connections
let isDBConnected = false;
let isCloudinaryConnected = false;

// Lazy initialization for serverless compatibility
const initializeServices = async () => {
  try {
    if (!isDBConnected) {
      const connectDB = require('./configs/db');
      await connectDB();
      isDBConnected = true;
    }
    
    if (!isCloudinaryConnected) {
      const { connectCloudinary } = require('./configs/cloudinary');
      connectCloudinary();
      isCloudinaryConnected = true;
    }
  } catch (error) {
    console.error('❌ Service initialization error:', error.message);
  }
};

// Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
const allowedOrigins = [
  "https://startup-frontend-steel.vercel.app",
  "http://localhost:3000",                   
  "http://localhost:5173",
  process.env.FRONTEND_URL,
  // Add Vercel preview URLs
  /https:\/\/.*\.vercel\.app$/,
  /https:\/\/.*\.vercel\.app$/
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    console.log(`🌐 Request from origin: ${origin}`);
    console.log(`🏭 Environment: ${process.env.NODE_ENV}`);
    console.log(`✅ Allowed origins:`, allowedOrigins);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ Origin "${origin}" is in allowed list`);
      return callback(null, true);
    }
    
    // For development, allow localhost origins
    if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
      console.log(`✅ Origin "${origin}" is localhost in development`);
      return callback(null, true);
    }
    
    // For production, allow vercel.app domains
    if (process.env.NODE_ENV === 'production' && origin.includes('vercel.app')) {
      console.log(`✅ Origin "${origin}" is vercel.app in production`);
      return callback(null, true);
    }
    
    console.error(`❌ CORS error: Origin "${origin}" not allowed`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Optional: Handle all OPTIONS preflight requests
app.options('*', cors(corsOptions));

// Health Check Routes
app.get('/', async (req, res) => {
  try {
    await initializeServices();
    res.json({
      message: 'E-Commerce Startup API is running!',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      cors: {
        allowedOrigins,
        environment: process.env.NODE_ENV
      },
      services: {
        database: isDBConnected,
        cloudinary: isCloudinaryConnected
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    await initializeServices();
    res.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      cors: {
        allowedOrigins,
        environment: process.env.NODE_ENV
      },
      services: {
        database: isDBConnected,
        cloudinary: isCloudinaryConnected
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// CORS Test endpoint
app.get('/api/cors-test', (req, res) => {
  res.json({
    message: 'CORS test successful',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Simple test endpoint (no database required)
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Server is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Initialize services before API routes
const initializeServicesForAPI = async (req, res, next) => {
  try {
    await initializeServices();
    next();
  } catch (error) {
    console.error('❌ Service initialization failed:', error.message);
    res.status(500).json({
      message: 'Service unavailable',
      error: error.message
    });
  }
};

// API Routes
app.use('/api/user', initializeServicesForAPI, userRoutes);
app.use('/api/seller', initializeServicesForAPI, sellerRoutes);
app.use('/api/product', initializeServicesForAPI, productRoutes);
app.use('/api/cart', initializeServicesForAPI, cartRoutes);
app.use('/api/address', initializeServicesForAPI, addressRoutes);
app.use('/api/order', initializeServicesForAPI, orderRoutes);
app.use('/api/contact', initializeServicesForAPI, contactRoutes);
app.use('/api/analytics', initializeServicesForAPI, analyticsRoutes);
app.use('/api/payment', initializeServicesForAPI, paymentRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔴 Global Error:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start Server (only if not in Vercel environment)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless functions
module.exports = app;
