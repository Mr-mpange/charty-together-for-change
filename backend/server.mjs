import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from parent directory
dotenv.config({ path: 'c:\\Users\\hp\\Desktop\\charty-together-for-change\\.env' });

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import mongoose from 'mongoose';
import axios from 'axios';

const app = express();

// Initialize MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      maxPoolSize: 10,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️ Continuing without database connection...');
  }
};

// Connect to database
connectDB();

// Zenopay Payment Service
class ZenopayService {
  constructor() {
    this.baseURL = process.env.ZENOPAY_BASE_URL || 'https://zenoapi.com/api';
    this.apiKey = process.env.ZENOPAY_API_KEY;

    if (!this.apiKey) {
      console.log('⚠️ No ZENOPAY_API_KEY found, using demo mode');
      this.apiKey = 'demo_api_key_placeholder';
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey
      }
    });
  }

  async initiateMobileMoneyPayment(paymentData) {
    try {
      if (this.apiKey === 'demo_api_key_placeholder') {
        return {
          success: true,
          orderId: 'demo_' + Date.now(),
          paymentStatus: 'PENDING',
          reference: `REF_${Date.now()}`,
          metadata: paymentData.metadata
        };
      }

      const payload = {
        order_id: `order_${Date.now()}`,
        buyer_name: paymentData.buyerName,
        buyer_phone: paymentData.buyerPhone,
        buyer_email: paymentData.buyerEmail,
        amount: paymentData.amount,
        webhook_url: paymentData.webhookUrl
      };

      console.log('[zenopay] Sending payload to API:', JSON.stringify(payload, null, 2));
      const response = await this.client.post('/payments/mobile_money_tanzania', payload);
      console.log('[zenopay] Full API response:', JSON.stringify(response.data, null, 2));

      // Handle potential key mismatches in response
      return {
        success: true,
        orderId: response.data.order_id || `order_${Date.now()}`,
        paymentStatus: response.data.payment_status || 'PENDING',
        reference: response.data.reference || `REF_${Date.now()}`,
        metadata: response.data.metadata || paymentData.metadata
      };
    } catch (error) {
      console.error('[zenopay] API call failed:', error.response?.data || error.message);
      console.error('[zenopay] Status code:', error.response?.status);
      throw new Error(`Payment initiation failed: ${error.response?.data?.message || error.message}`);
    }
  }
}

const zenopayService = new ZenopayService();

// Config
const PORT = process.env.PORT || 3001;
const API_PREFIX = '/api';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:8086,http://192.168.137.1:8086,http://192.168.1.200:8086';
const ALLOWED_ORIGINS = CORS_ORIGIN.split(',').map((s) => s.trim());

// Middleware
app.use(express.json({ limit: '1mb' }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow curl/postman/no-origin
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error('CORS not allowed from origin: ' + origin), false);
    },
  })
);

// Healthcheck
app.get(`${API_PREFIX}/health`, (req, res) => {
  res.json({ status: 'ok', ts: Date.now() });
});

// Setup email transporter (supports Gmail, SMTP, and Mailtrap)
let transporter = null;
const emailProvider = process.env.EMAIL_PROVIDER || 'gmail';

function createEmailTransporter() {
  let config = {};
  
  switch (emailProvider.toLowerCase()) {
    case 'gmail':
      if (process.env.GMAIL_HOST && process.env.GMAIL_USER && process.env.GMAIL_PASS) {
        config = {
          host: process.env.GMAIL_HOST,
          port: Number(process.env.GMAIL_PORT) || 587,
          secure: process.env.GMAIL_SECURE === 'true',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        };
        console.log('[email] Using Gmail SMTP configuration');
      }
      break;
      
    case 'mailtrap':
      if (process.env.MAILTRAP_HOST && process.env.MAILTRAP_USER && process.env.MAILTRAP_PASS) {
        config = {
          host: process.env.MAILTRAP_HOST,
          port: Number(process.env.MAILTRAP_PORT) || 2525,
          secure: false,
          auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
          },
        };
        console.log('[email] Using Mailtrap configuration');
      }
      break;
      
    case 'smtp':
    default:
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        config = {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        };
        console.log('[email] Using generic SMTP configuration');
      }
      break;
  }
  
  if (Object.keys(config).length > 0) {
    return nodemailer.createTransport(config);
  }
  
  return null;
}

transporter = createEmailTransporter();

if (transporter) {
  transporter
    .verify()
    .then(() => console.log(`[email] ${emailProvider.toUpperCase()} server is ready to send messages`))
    .catch((err) => console.warn(`[email] ${emailProvider.toUpperCase()} verification failed:`, err?.message || err));
} else {
  console.warn(`[email] ${emailProvider.toUpperCase()} env vars not fully set. Contact emails will be logged to console only.`);
}

// Setup SMS client (Twilio) - optional
let smsClient = null;
const hasTwilio = Boolean(
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_FROM
);

if (hasTwilio) {
  try {
    smsClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log('[sms] Twilio client configured');
  } catch (err) {
    console.warn('[sms] Failed to configure Twilio client:', err?.message || err);
  }
} else {
  console.warn('[sms] Twilio env vars not fully set. SMS will be skipped.');
}


function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  // Accept E.164 or simple numeric (will be normalized to E.164 if missing '+')
  return /^\+?[1-9]\d{7,14}$/.test(String(phone || '').trim());
}

function getEmailUser() {
  switch (emailProvider.toLowerCase()) {
    case 'gmail':
      return process.env.GMAIL_USER;
    case 'mailtrap':
      return process.env.MAILTRAP_USER;
    case 'smtp':
    default:
      return process.env.SMTP_USER;
  }
}

// Routes
// 1) Contact form - sends email if SMTP configured
app.post(`${API_PREFIX}/contact`, async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields: name, email, message' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    const cleanedSubject = subject && String(subject).trim().length > 0 ? String(subject).trim() : 'New Contact Message';

    // Always log incoming contact
    console.log('[contact] submission:', { name, email, phone, subject: cleanedSubject, message });

    // Send email to support inbox if transporter is configured
    if (transporter) {
      const toAddress = process.env.SUPPORT_EMAIL || getEmailUser();
      const orgName = process.env.ORG_NAME || 'Charty';

      const textBody = `You have received a new contact message.\n\n` +
        `From: ${name} <${email}>\n` +
        `Subject: ${cleanedSubject}\n` +
        `Message:\n${message}\n\n` +
        `Time: ${new Date().toISOString()}`;

      const mailOptions = {
        from: `${orgName} Contact <${getEmailUser()}>`,
        to: toAddress,
        subject: `[Contact] ${cleanedSubject}`,
        text: textBody,
        replyTo: email,
      };

      await transporter.sendMail(mailOptions);

      // Optional: Send acknowledgement to sender
      if (process.env.SEND_ACK === 'true') {
        const ackText = `Hi ${name},\n\n` +
          `Thanks for reaching out to ${orgName}. We have received your message and will get back to you within 24 hours.\n\n` +
          `Your message:\n${message}\n\n` +
          `Regards,\n${orgName} Team`;

        await transporter.sendMail({
          from: `${orgName} Support <${getEmailUser()}>`,
          to: email,
          subject: 'We received your message',
          text: ackText,
        });
      }
    }

    // Send thanks SMS if Twilio is configured and a phone number is provided
    if (smsClient && phone) {
      const normalized = phone.startsWith('+') ? phone : '+' + String(phone).replace(/[^0-9]/g, '');
      if (isValidPhone(normalized)) {
        const orgName = process.env.ORG_NAME || 'Charty';
        const smsBody = `Hi ${name}, thanks for contacting ${orgName}. We received your message and will get back to you within 24 hours.`;
        try {
          await smsClient.messages.create({
            body: smsBody,
            from: process.env.TWILIO_FROM,
            to: normalized,
          });
        } catch (e) {
          console.warn('[contact][sms] failed:', e?.message || e);
        }
      } else {
        console.warn('[contact][sms] invalid phone provided (expect E.164):', phone);
      }
    } else if (phone) {
      // phone provided but SMS not configured
      console.warn('[contact][sms] Twilio not configured. Skipping SMS.');
    }

    return res.json({ success: true, message: "Thank you for your message. We'll get back to you within 24 hours." });
  } catch (err) {
    console.error('[contact] error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// 2) Donation processing - stubbed (no gateway). Simulates success and returns txn id.
app.post(`${API_PREFIX}/donations`, async (req, res) => {
  try {
    const { amount, type, paymentMethod, donorInfo } = req.body || {};

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const firstName = donorInfo?.firstName;
    const lastName = donorInfo?.lastName;
    const donorEmail = donorInfo?.email;

    if (!firstName || !lastName || !donorEmail || !isValidEmail(donorEmail)) {
      return res.status(400).json({ success: false, message: 'Missing or invalid donor details' });
    }

    // Simulate processing
    const transactionId = 'txn_' + Date.now();
    console.log('[donation] processed:', { amount, type, paymentMethod, donorInfo, transactionId });

    // Optional: email receipt to donor if SMTP is configured
    if (transporter) {
      const orgName = process.env.ORG_NAME || 'Charty';
      const receiptText = `Hi ${firstName},\n\n` +
        `Thank you for your ${type || 'one-time'} donation of ${amount}.\n` +
        `Transaction ID: ${transactionId}\n\n` +
        `Your support helps us continue our mission.\n\n` +
        `Regards,\n${orgName} Team`;
      await transporter.sendMail({
        from: `${orgName} Donations <${getEmailUser()}>`,
        to: donorEmail,
        subject: `Donation Receipt - ${transactionId}`,
        text: receiptText,
      });

      // Optional: forward donation notification to support inbox
      if (process.env.SUPPORT_EMAIL) {
        const notifyText = `Donation received.\n\n` +
          `Name: ${firstName} ${lastName}\n` +
          `Email: ${donorEmail}\n` +
          `Amount: ${amount}\n` +
          `Type: ${type || 'one-time'}\n` +
          `Payment Method: ${paymentMethod || 'n/a'}\n` +
          `Transaction ID: ${transactionId}`;
        await transporter.sendMail({
          from: `${orgName} Donations <${getEmailUser()}>`,
          to: process.env.SUPPORT_EMAIL,
          subject: `[Donation] ${amount} - ${transactionId}`,
          text: notifyText,
        });
      }
    }

    return res.json({ success: true, transactionId, message: 'Thank you for your donation! Your contribution will make a real difference.' });
  } catch (err) {
    console.error('[donations] error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process donation' });
  }
});

// 3) Public content endpoints (static data for now)
app.get(`${API_PREFIX}/leaders`, (req, res) => {
  const leaders = [
    {
      id: 1,
      name: 'Anuary Ghusub',
      title: 'Chief Director',
      image: 'https://api.example.com/images/leader-1.jpg',
      bio: 'Anuary Ghusub brings over 06 years of experience...',
      email: 'anuary@chartyevents.org',
      linkedin: 'https://linkedin.com/in/anuary-ghusub',
    },
  ];
  res.json(leaders);
});

app.get(`${API_PREFIX}/gallery`, (req, res) => {
  const gallery = [
    {
      id: 1,
      image: 'https://api.example.com/images/gallery-1.jpg',
      title: 'School Equipment Distribution',
      category: 'Education',
      date: 'December 2024',
      location: 'Dar es Salaam',
      description: 'Distributing essential school supplies...',
    },
  ];
  res.json(gallery);
});

app.get(`${API_PREFIX}/services`, (req, res) => {
  const services = [
    {
      id: 1,
      icon: 'GraduationCap',
      title: 'School Equipment Support',
      description: 'Providing essential educational materials...',
      image: 'https://api.example.com/images/service-1.jpg',
      features: ['School Supplies', 'Books & Materials', 'Uniforms', 'Learning Equipment'],
    },
  ];
  res.json(services);
});

app.get(`${API_PREFIX}/about`, (req, res) => {
  const about = {
    mission: 'To empower communities and transform lives through compassionate service...',
    vision: 'A world where every child has access to quality education...',
    values: [
      { icon: 'Users', title: 'Community Focused', description: 'We work directly with local communities...' },
      { icon: 'Heart', title: 'Compassion', description: 'We serve with empathy and care.' },
      { icon: 'Shield', title: 'Integrity', description: 'We are transparent and accountable.' },
    ],
    impactStats: [
      { icon: 'Heart', number: '1,500+', label: 'Children Supported' },
      { icon: 'Shield', number: '98%', label: 'Funds to Programs' },
      { icon: 'Users', number: '300+', label: 'Volunteers' },
    ],
  };
  res.json(about);
});

app.get(`${API_PREFIX}/impact-stats`, (req, res) => {
  const stats = [
    { icon: 'Heart', number: '1,500+', label: 'Children Supported' },
    { icon: 'Shield', number: '98%', label: 'Funds to Programs' },
    { icon: 'Users', number: '300+', label: 'Volunteers' },
  ];
  res.json(stats);
});

// Zenopay Payment Endpoints
// 1) Mobile Money Payment (Tanzania)
app.post(`${API_PREFIX}/payments/mobile_money_tanzania`, async (req, res) => {
  try {
    const { buyerName, buyerPhone, buyerEmail, amount, currency, webhookUrl, metadata } = req.body;

    if (!buyerName || !buyerPhone || !buyerEmail || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: buyerName, buyerPhone, buyerEmail, amount'
      });
    }

    console.log('[zenopay] Initiating mobile money payment:', { buyerName, buyerPhone, amount });

    // Call Zenopay API
    const paymentResult = await zenopayService.initiateMobileMoneyPayment({
      buyerName,
      buyerPhone,
      buyerEmail,
      amount,
      currency: currency || 'TZS',
      webhookUrl: webhookUrl || process.env.ZENOPAY_WEBHOOK_URL,
      metadata
    });

    console.log('[zenopay] Mobile money payment initiated successfully:', paymentResult);

    return res.json({
      success: true,
      message: 'Payment initiated successfully',
      data: {
        orderId: paymentResult.orderId,
        paymentStatus: paymentResult.paymentStatus,
        reference: paymentResult.reference,
        displayAmount: `${amount} ${currency || 'TZS'}`,
        originalAmount: amount,
        originalCurrency: currency || 'TZS',
        metadata: paymentResult.metadata
      }
    });

  } catch (error) {
    console.error('[zenopay] Mobile money payment failed:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to initiate mobile money payment'
    });
  }
});

// 2) Card Payment
app.post(`${API_PREFIX}/payments/card`, async (req, res) => {
  try {
    const {
      buyerName, buyerPhone, buyerEmail, amount, currency,
      cardNumber, expiryMonth, expiryYear, cvv, cardHolderName,
      webhookUrl, metadata
    } = req.body;

    if (!buyerName || !buyerEmail || !amount || !cardNumber || !expiryMonth || !expiryYear || !cvv || !cardHolderName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    console.log('[zenopay] Initiating card payment for:', buyerName);

    // In a real implementation, you would call zenopayService.initiateCardPayment
    // For now, simulate success
    const orderId = `card_${Date.now()}`;
    const reference = `REF_${Date.now()}`;

    console.log('[zenopay] Card payment initiated successfully');

    return res.json({
      success: true,
      message: 'Card payment initiated successfully',
      data: {
        orderId,
        paymentStatus: 'PENDING',
        reference,
        displayAmount: `${amount} ${currency || 'TZS'}`,
        originalAmount: amount,
        originalCurrency: currency || 'TZS',
        redirectUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/${orderId}`,
        metadata
      }
    });

  } catch (error) {
    console.error('[zenopay] Card payment failed:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to initiate card payment'
    });
  }
});

// 3) Bank Transfer Payment
app.post(`${API_PREFIX}/payments/bank_transfer`, async (req, res) => {
  try {
    const {
      buyerName, buyerPhone, buyerEmail, amount, currency,
      accountNumber, bankCode, accountHolderName,
      webhookUrl, metadata
    } = req.body;

    if (!buyerName || !buyerEmail || !amount || !accountNumber || !accountHolderName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    console.log('[zenopay] Initiating bank transfer for:', buyerName);

    // In a real implementation, you would call zenopayService.initiateBankPayment
    // For now, simulate success
    const orderId = `bank_${Date.now()}`;
    const reference = `REF_${Date.now()}`;

    console.log('[zenopay] Bank transfer initiated successfully');

    return res.json({
      success: true,
      message: 'Bank transfer initiated successfully',
      data: {
        orderId,
        paymentStatus: 'PENDING',
        reference,
        displayAmount: `${amount} ${currency || 'TZS'}`,
        originalAmount: amount,
        originalCurrency: currency || 'TZS',
        bankDetails: {
          accountNumber: '1234567890',
          bankName: 'Sample Bank',
          accountName: 'Charty Foundation',
          reference: reference
        },
        metadata
      }
    });

  } catch (error) {
    console.error('[zenopay] Bank transfer failed:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to initiate bank transfer'
    });
  }
});

// 4) Check Payment Status
app.get(`${API_PREFIX}/payments/order-status/:orderId`, async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    console.log('[zenopay] Checking payment status for:', orderId);

    // In a real implementation, you would check with Zenopay API
    // For now, simulate different statuses
    const mockStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'];
    const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];

    return res.json({
      success: true,
      orderId,
      paymentStatus: randomStatus,
      reference: `REF_${orderId}`,
      timestamp: new Date().toISOString(),
      metadata: {}
    });

  } catch (error) {
    console.error('[zenopay] Status check failed:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to check payment status'
    });
  }
});

// 5) Zenopay Webhook Handler
app.post(`${API_PREFIX}/webhooks/zenopay`, async (req, res) => {
  try {
    const webhookData = req.body;
    console.log('[zenopay-webhook] Received webhook:', JSON.stringify(webhookData, null, 2));

    const { order_id, payment_status, reference, transaction_id, metadata } = webhookData;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Update payment status in database (if using MongoDB)
    console.log(`[zenopay-webhook] Payment ${order_id} status: ${payment_status}`);

    // Here you would:
    // 1. Update payment record in database
    // 2. Send confirmation email to donor
    // 3. Update donation status
    // 4. Trigger any post-payment actions

    return res.json({
      success: true,
      message: 'Webhook processed successfully',
      orderId: order_id,
      status: payment_status,
      processed: true
    });

  } catch (error) {
    console.error('[zenopay-webhook] Processing failed:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message
    });
  }
});

// 6) Get Supported Payment Methods
app.get(`${API_PREFIX}/payments/methods`, (req, res) => {
  const methods = [
    {
      id: 'mobile',
      name: 'Mobile Money',
      description: 'Pay with M-Pesa, Tigo Pesa, Airtel Money, or HaloPesa',
      providers: ['M-Pesa', 'Tigo Pesa', 'Airtel Money', 'HaloPesa'],
      currencies: ['TZS'],
      minAmount: 100,
      maxAmount: 1000000
    },
    {
      id: 'card',
      name: 'Card Payment',
      description: 'Pay with Visa, Mastercard, or other cards',
      providers: ['Visa', 'Mastercard', 'American Express'],
      currencies: ['TZS', 'USD'],
      minAmount: 1000,
      maxAmount: 5000000
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      description: 'Transfer directly from your bank account',
      providers: ['All Tanzanian Banks'],
      currencies: ['TZS', 'USD'],
      minAmount: 1000,
      maxAmount: 10000000
    }
  ];

  res.json({
    success: true,
    methods
  });
});

// 8) AI Bot endpoint
app.post(`${API_PREFIX}/ai-bot`, async (req, res) => {
  try {
    const { message, context } = req.body || {};

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    console.log('[ai-bot] Processing message:', message);

    // Get AI response (async operation)
    const aiResponse = await getAIBotResponse(message.trim(), context);

    console.log('[ai-bot] Response generated successfully');

    return res.json({
      success: true,
      message: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[ai-bot] Error processing request:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to process AI bot request',
      error: err?.message || err
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Charty Backend API running on port ${PORT}`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}${API_PREFIX}`);
});
