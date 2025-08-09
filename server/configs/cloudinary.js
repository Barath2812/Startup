const { v2: cloudinary } = require("cloudinary");

const connectCloudinary = () => {
  try {
    // Check if required environment variables are available
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      console.warn('⚠️ Cloudinary environment variables not set, skipping Cloudinary initialization');
      return;
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    
    console.log('✅ Cloudinary configured successfully');
  } catch (error) {
    console.error('❌ Cloudinary configuration error:', error.message);
  }
};

module.exports = { cloudinary, connectCloudinary };
