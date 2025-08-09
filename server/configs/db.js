const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB already connected');
      return;
    }

    // Check if MONGODB_URI is available
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is not set');
      throw new Error('MONGODB_URI is required');
    }

    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connection established');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('❌ MongoDB connection disconnected');
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/rootcare`, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
};

module.exports = connectDB;
