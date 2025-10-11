// Backend API for Charty - Contact (with email support), Donations, and Public Content
import { GoogleGenerativeAI } from '@google/generative-ai';

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

dotenv.config();

const app = express();

// Initialize Gemini AI client
let genAI = null;
const geminiApiKey = process.env.AI_BOT_API_KEY || process.env.GEMINI_API_KEY;

if (geminiApiKey && geminiApiKey !== 'your-ai-api-key-here') {
  try {
    genAI = new GoogleGenerativeAI(geminiApiKey);
    console.log('[ai-bot] Gemini AI client initialized');
  } catch (err) {
    console.warn('[ai-bot] Failed to initialize Gemini AI client:', err?.message || err);
  }
} else {
  console.warn('[ai-bot] Gemini API key not configured. AI bot will use fallback responses.');
}

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

// AI Bot function
async function getAIBotResponse(message, context = '') {
  // If Gemini AI is not configured, use fallback responses
  if (!genAI) {
    return getFallbackResponse(message);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const organizationContext = `
    You are an AI assistant for Al Nahd Charty Foundation (Charty Events), a charitable organization in Tanzania.
    Organization details:
    - Name: Al Nahd Charty Foundation
    - Location: Dar es Salaam, Tanzania
    - Contact: kilindosaid771@gmail.com, Phone: 0683859574
    - WhatsApp: +255683859574
    - Mission: Empowering communities and transforming lives through compassionate service
    - Focus areas: Education support, school equipment, community development

    You should provide helpful, accurate information about the organization, its services, and how people can get involved or donate.
    Be friendly, professional, and informative. If users ask about topics outside your knowledge, direct them to contact the organization directly.
    `;

    const prompt = `${organizationContext}\n\nUser question: ${message}\n\nProvide a helpful response:`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('[ai-bot] Error calling Gemini API:', error?.message || error);
    return getFallbackResponse(message);
  }
}

// Fallback responses for when Gemini API is not available
function getFallbackResponse(message) {
  const msg = message.toLowerCase();

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('help')) {
    return "Hello! I'm the AI assistant for Al Nahd Charty Foundation. I can help you learn about our organization, services, and how to get involved. What would you like to know?";
  }

  if (msg.includes('about') || msg.includes('organization') || msg.includes('foundation')) {
    return "Al Nahd Charty Foundation is a charitable organization based in Dar es Salaam, Tanzania. We focus on empowering communities through education support, school equipment distribution, and community development initiatives.";
  }

  if (msg.includes('services') || msg.includes('programs') || msg.includes('work')) {
    return "We provide school equipment support, educational materials, and work to empower local communities. Our main focus is on education and helping children access quality learning resources.";
  }

  if (msg.includes('donate') || msg.includes('support') || msg.includes('contribute')) {
    return "Thank you for your interest in supporting our cause! You can donate through our website or contact us at kilindosaid771@gmail.com for more information about donation options.";
  }

  if (msg.includes('contact') || msg.includes('email') || msg.includes('phone')) {
    return "You can reach us at kilindosaid771@gmail.com or call 0683859574. For quick inquiries, you can also WhatsApp us at +255683859574.";
  }

  if (msg.includes('location') || msg.includes('where') || msg.includes('address')) {
    return "We are located in Dar es Salaam, Tanzania. For specific address details, please contact us directly.";
  }

  if (msg.includes('volunteer') || msg.includes('volunteering') || msg.includes('help')) {
    return "We welcome volunteers! Please contact us at kilindosaid771@gmail.com to learn about current volunteer opportunities.";
  }

  return "Thank you for your question about Al Nahd Charty Foundation. For more detailed information, please contact us at kilindosaid771@gmail.com or call 0683859574.";
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

// 4) AI Bot endpoint
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
