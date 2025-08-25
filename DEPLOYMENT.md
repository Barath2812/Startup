# 🚀 Vercel Deployment Guide

This guide will help you deploy your E-Commerce Startup platform to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Environment Variables**: Set up all required environment variables

## 🎯 Deployment Options

### Option 1: Monorepo Deployment (Recommended)

Deploy both frontend and backend together in a single Vercel project.

#### Steps:

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
   Add these environment variables in Vercel dashboard:

   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # JWT
   JWT_SECRET=your_jwt_secret
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   
   # Payment
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   GOOGLE_PAY_MERCHANT_ID=your_google_pay_merchant_id
   GOOGLE_PAY_MERCHANT_NAME=Your Store Name
   
   # Email
   EMAIL_USER=your_email
   EMAIL_PASSWORD=your_email_password
   
   # Seller
   SELLER_EMAIL=seller@yourstore.com
   SELLER_PASSWORD=your_seller_password
   
   # Server
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-domain.vercel.app
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

### Option 2: Separate Deployments

Deploy frontend and backend as separate Vercel projects.

#### Frontend Deployment:

1. **Create Frontend Project**:
   - Root Directory: `./client`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Environment Variables**:
   ```env
   VITE_BACKEND_URL=https://your-backend-domain.vercel.app
   VITE_CURRENCY=₹
   ```

#### Backend Deployment:

1. **Create Backend Project**:
   - Root Directory: `./server`
   - Framework Preset: Node.js
   - Build Command: `npm install`
   - Output Directory: `./`

2. **Environment Variables**:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   GOOGLE_PAY_MERCHANT_ID=your_google_pay_merchant_id
   GOOGLE_PAY_MERCHANT_NAME=Your Store Name
   EMAIL_USER=your_email
   EMAIL_PASSWORD=your_email_password
   SELLER_EMAIL=seller@yourstore.com
   SELLER_PASSWORD=your_seller_password
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

## 🔧 Configuration Files

### Root `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/client/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "server/server.js": {
      "maxDuration": 30
    }
  }
}
```

### Client `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Server `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

## 🌐 Domain Configuration

### Custom Domain:
1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Environment Variables Update:
After setting up custom domain, update:
```env
FRONTEND_URL=https://your-custom-domain.com
```

## 🔍 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check if all dependencies are installed
   - Verify environment variables are set
   - Check build logs in Vercel dashboard

2. **API Errors**:
   - Ensure backend is deployed correctly
   - Check CORS configuration
   - Verify API routes are working

3. **Database Connection**:
   - Ensure MongoDB URI is correct
   - Check if MongoDB Atlas IP whitelist includes Vercel IPs
   - Verify database credentials

4. **Payment Issues**:
   - Check if payment environment variables are set
   - Verify Google Pay/Razorpay configurations
   - Test payment flow in development first

### Debug Steps:

1. **Check Vercel Logs**:
   - Go to project dashboard
   - Click "Functions" tab
   - Check function logs for errors

2. **Test API Endpoints**:
   - Use tools like Postman or curl
   - Test health check endpoint: `https://your-domain.vercel.app/api/health`

3. **Verify Environment Variables**:
   - Check if all required variables are set
   - Ensure no typos in variable names

## 📞 Support

If you encounter issues:

1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Review build logs in Vercel dashboard
3. Test locally first to isolate issues
4. Check GitHub issues for similar problems

## 🎉 Success!

Once deployed successfully:

1. **Test the application**:
   - Navigate to your Vercel domain
   - Test user registration/login
   - Test product browsing
   - Test payment flow
   - Test seller dashboard

2. **Monitor performance**:
   - Check Vercel analytics
   - Monitor API response times
   - Set up error tracking

3. **Set up monitoring**:
   - Configure error alerts
   - Set up performance monitoring
   - Monitor database usage

Your E-Commerce Startup platform is now live on Vercel! 🚀
