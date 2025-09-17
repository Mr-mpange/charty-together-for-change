# Backend API Documentation

This document outlines the expected backend API endpoints that the frontend application connects to.

## Base URL
```
http://localhost:3001/api
```

## Authentication
All endpoints (except public ones) require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### 1. Contact Form Submission
**POST** `/contact`

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
**POST** `/donations`

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

### 3. Get Leaders
**GET** `/leaders`

Retrieve the leadership team information.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Anuary Ghusub",
    "title": "Chief Director",
    "image": "https://api.example.com/images/leader-1.jpg",
    "bio": "Anuary Ghusub brings over 06 years of experience...",
    "email": "anuary@chartyevents.org",
    "linkedin": "https://linkedin.com/in/anuary-ghusub"
  }
]
```

### 4. Get Gallery Items
**GET** `/gallery`

Retrieve gallery images and metadata.

**Response:**
```json
[
  {
    "id": 1,
    "image": "https://api.example.com/images/gallery-1.jpg",
    "title": "School Equipment Distribution",
    "category": "Education",
    "date": "December 2024",
    "location": "Dar es Salaam",
    "description": "Distributing essential school supplies..."
  }
]
```

### 5. Get Services
**GET** `/services`

Retrieve services information.

**Response:**
```json
[
  {
    "id": 1,
    "icon": "GraduationCap",
    "title": "School Equipment Support",
    "description": "Providing essential educational materials...",
    "image": "https://api.example.com/images/service-1.jpg",
    "features": ["School Supplies", "Books & Materials", "Uniforms", "Learning Equipment"]
  }
]
```

### 6. Get About Content
**GET** `/about`

Retrieve about section content.

**Response:**
```json
{
  "mission": "To empower communities and transform lives through compassionate service...",
  "vision": "A world where every child has access to quality education...",
  "values": [
    {
      "icon": "Users",
      "title": "Community Focused",
      "description": "We work directly with local communities..."
    }
  ],
  "impactStats": [
    {
      "icon": "Heart",
      "number": "1,500+",
      "label": "Children Supported"
    }
  ]
}
```

### 7. Get Impact Statistics
**GET** `/impact-stats`

Retrieve impact statistics.

**Response:**
```json
[
  {
    "icon": "Heart",
    "number": "1,500+",
    "label": "Children Supported"
  },
  {
    "icon": "Shield",
    "number": "98%",
    "label": "Funds to Programs"
  }
]
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Example Backend Implementation (Node.js/Express)

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
    // await saveContactMessage({ name, email, subject, message });
    
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
    
    // Process payment with payment gateway
    // const paymentResult = await processPayment({ amount, paymentMethod });
    
    // Save donation record
    // await saveDonation({ amount, type, donorInfo, transactionId: paymentResult.id });
    
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

// Get leaders endpoint
app.get('/api/leaders', async (req, res) => {
  try {
    // Fetch from database
    // const leaders = await getLeaders();
    
    const leaders = [
      {
        id: 1,
        name: 'Anuary Ghusub',
        title: 'Chief Director',
        image: 'https://api.example.com/images/leader-1.jpg',
        bio: 'Anuary Ghusub brings over 06 years of experience...',
        email: 'anuary@chartyevents.org',
        linkedin: 'https://linkedin.com/in/anuary-ghusub'
      }
    ];
    
    res.json(leaders);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaders'
    });
  }
});

// Similar implementations for other endpoints...

app.listen(3001, () => {
  console.log('Backend API server running on port 3001');
});
```

## Environment Variables

Create a `.env` file in your backend project:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/charty_events

# Payment Gateway
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# JWT Secret
JWT_SECRET=your-jwt-secret-key

# CORS
CORS_ORIGIN=http://localhost:5173
```

## Database Schema Examples

### Leaders Table
```sql
CREATE TABLE leaders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  image_url TEXT,
  bio TEXT,
  email VARCHAR(255),
  linkedin_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

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

This documentation provides a complete guide for implementing the backend API that the frontend application expects to connect to.
