# Server Setup

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Email (Gmail)
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Server
PORT=5000
```

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your test API keys from the Stripe Dashboard
3. Set up a webhook endpoint in Stripe Dashboard:
   - URL: `https://your-domain.com/api/order/webhook`
   - Events: `checkout.session.completed`
4. Copy the webhook secret to your `.env` file

## Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use your Gmail address and the generated app password in `.env`
4. All order notifications will be sent to `pramoothsaionraise@gmail.com`

## Installation

```bash
npm install
npm start
```

## API Endpoints

- `POST /api/order/cod` - Place COD order
- `POST /api/order/stripe` - Create Stripe checkout session
- `POST /api/order/webhook` - Stripe webhook handler
- `GET /api/order/user` - Get user orders
- `GET /api/order/seller` - Get all orders (seller) 