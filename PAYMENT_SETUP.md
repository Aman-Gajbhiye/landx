# Payment Gateway Setup (Razorpay)

This application uses Razorpay for payment processing. Follow these steps to set up payments:

## Development Setup

For development and testing, the application uses test keys. The current setup will work out of the box, but you should replace the test keys with your own.

## Getting Your Razorpay Keys

1. **Sign up for Razorpay Account**
   - Visit https://razorpay.com/
   - Create an account or log in
   - Go to Dashboard → Settings → API Keys

2. **Get Test Keys (for Development)**
   - In Razorpay Dashboard, switch to "Test Mode"
   - Generate Test Keys
   - Copy the Key ID and Key Secret

3. **Get Live Keys (for Production)**
   - Switch to "Live Mode" in Razorpay Dashboard
   - Generate Live Keys
   - Copy the Key ID and Key Secret

## Configuration

### Backend Configuration

Update the Razorpay configuration in `backend/server.js`:

```javascript
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'your_test_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_test_key_secret'
});
```

### Using Environment Variables (Recommended)

Create a `.env` file in the `backend` directory:

```env
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
```

Then update `server.js` to use environment variables:

```javascript
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
```

### Frontend Configuration

The Razorpay Key ID is returned from the backend when creating a payment order, so no frontend configuration is needed.

## Testing Payments

### Test Mode

When using test keys, you can test payments with:

- **Test Cards**: Use Razorpay test cards
  - Card Number: `4111 1111 1111 1111`
  - CVV: Any 3 digits
  - Expiry: Any future date

- **Test UPI**: Use test UPI IDs provided by Razorpay
  - Example: `success@razorpay` (always succeeds)
  - Example: `failure@razorpay` (always fails)

### Webhook Setup (Optional)

For production, set up webhooks to handle payment status updates:

1. In Razorpay Dashboard, go to Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
3. Select events: `payment.authorized`, `payment.captured`, `payment.failed`

## Payment Flow

1. **Create Order**: Frontend calls `/api/payments/create-order`
2. **Razorpay Checkout**: User completes payment via Razorpay modal
3. **Payment Success**: Razorpay returns payment ID and signature
4. **Verify Payment**: Frontend calls `/api/payments/verify` to verify signature
5. **Process Investment**: After verification, investment is processed

## Features

- ✅ Multiple payment methods (Wallet or Gateway)
- ✅ Payment gateway integration (Razorpay)
- ✅ Payment verification and security
- ✅ Automatic wallet top-up after payment
- ✅ Investment processing after payment success
- ✅ Test mode support

## Security Notes

- Never expose your Razorpay Key Secret in frontend code
- Always verify payment signatures on the backend
- Use HTTPS in production
- Store sensitive keys in environment variables
- Regularly rotate your API keys

## Support

For Razorpay integration issues:
- Razorpay Docs: https://razorpay.com/docs/
- Razorpay Support: support@razorpay.com
