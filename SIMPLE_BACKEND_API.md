# Simple Backend API - Contact & Payment Only

This document outlines the **minimal backend API** needed for just the contact form and donation functionality.

## Base URL
```
http://localhost:3001/api
```

## Required Endpoints (Only 2!)

### 1. Contact Form Submission
**POST** `/api/contact`

Submit a contact form message.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Partnership Inquiry",
  "message": "I would like to discuss partnership opportunities..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your message. We'll get back to you within 24 hours."
}
```

### 2. Donation Processing
**POST** `/api/donations`

Process a donation payment.

**Request Body:**
```json
{
  "amount": 100.00,
  "type": "one-time",
  "paymentMethod": "card",
  "donorInfo": {
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "message": "Keep up the great work!"
  }
}
```

**Response:**
```json
{
  "success": true,
  "transactionId": "txn_123456789",
  "message": "Thank you for your donation! Your contribution will make a real difference."
}
```

## Simple Backend Implementation (Node.js/Express)

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Save to database or send email
    console.log('Contact form submitted:', { name, email, subject, message });
    
    res.json({
      success: true,
      message: 'Thank you for your message. We\'ll get back to you within 24 hours.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// Donation endpoint
app.post('/api/donations', async (req, res) => {
  try {
    const { amount, type, paymentMethod, donorInfo } = req.body;
    
    // Validate required fields
    if (!amount || !donorInfo.firstName || !donorInfo.lastName || !donorInfo.email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Process payment with payment gateway (Stripe, PayPal, etc.)
    // const paymentResult = await processPayment({ amount, paymentMethod });
    
    // Save donation record
    console.log('Donation processed:', { amount, type, paymentMethod, donorInfo });
    
    res.json({
      success: true,
      transactionId: 'txn_' + Date.now(),
      message: 'Thank you for your donation!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process donation'
    });
  }
});

app.listen(3001, () => {
  console.log('Backend API server running on port 3001');
});
```

## Environment Variables

Create a `.env` file in your backend project:

```env
# Database (optional)
DATABASE_URL=postgresql://username:password@localhost:5432/charty_events

# Payment Gateway (optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Email Service (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Database Schema (Optional)

### Contact Messages Table
```sql
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Donations Table
```sql
CREATE TABLE donations (
  id SERIAL PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(50) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(255),
  donor_first_name VARCHAR(255) NOT NULL,
  donor_last_name VARCHAR(255) NOT NULL,
  donor_email VARCHAR(255) NOT NULL,
  donor_phone VARCHAR(255),
  donor_message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## What's Connected vs Static

### ✅ **Connected to Backend:**
- Contact form submission
- Donation processing

### 📄 **Static Content (No Backend Needed):**
- Leaders section
- Gallery section  
- Services section
- About section
- Impact statistics

## Testing

1. **Start the backend server:**
```bash
node server.js
```

2. **Start the frontend:**
```bash
npm run dev
```

3. **Test the forms:**
- Fill out the contact form and submit
- Fill out the donation form and submit
- Check the backend console for logged data

## Production Deployment

1. **Frontend:** Deploy to your hosting platform (Vercel, Netlify, etc.)
2. **Backend:** Deploy to your server (Railway, Heroku, DigitalOcean, etc.)
3. **Update API URL:** Set `VITE_API_BASE_URL` to your production backend URL

That's it! Only 2 API endpoints needed for contact and payment functionality.
