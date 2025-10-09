import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { config } from './config';

// Create axios instance for general API
const api: AxiosInstance = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for Zenopay API
const zenopayApi: AxiosInstance = axios.create({
  baseURL: config.payments.zenopay.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': config.payments.zenopay.apiKey,
  },
});

// Zenopay API Types
export interface ZenopayPaymentData {
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  amount: number;
  currency?: 'USD' | 'TZS';
  webhookUrl?: string;
  metadata?: Record<string, any>;
}

export interface CurrencyConversionData {
  amount: number;
  from?: 'USD' | 'TZS';
  to?: 'USD' | 'TZS';
}

export interface CurrencyRateInfo {
  rate: number;
  rateInfo: {
    from: string;
    to: string;
    rate: number;
    lastUpdated: string | null;
    source: string;
  };
  formatted: string;
}

export interface PaymentStatusData {
  orderId: string;
}

export interface MobileMoneyPaymentResponse {
  success: boolean;
  message: string;
  data: {
    orderId: string;
    paymentStatus: string;
    reference: string;
    amount: number;
    originalAmount: number;
    originalCurrency: string;
    displayAmount: string;
  };
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login or clear token
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

// API Types
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface DonationData {
  amount: number;
  type: 'one-time' | 'monthly';
  paymentMethod: 'card' | 'mobile' | 'bank';
  donorInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    message?: string;
  };
}

export interface Leader {
  id: number;
  name: string;
  title: string;
  image: string;
  bio: string;
  email: string;
  linkedin?: string;
}

export interface GalleryItem {
  id: number;
  image: string;
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
}

export interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  image: string;
  features: string[];
}

export interface ImpactStat {
  icon: string;
  number: string;
  label: string;
}

export interface AboutContent {
  mission: string;
  vision: string;
  values: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  impactStats: ImpactStat[];
}

// API Service Functions
export const apiService = {
  // Contact Form
  async submitContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/contact', data);
    return response.data;
  },

  // Donations (Legacy)
  async processDonation(data: DonationData): Promise<{ success: boolean; transactionId?: string; message: string }> {
    const response = await api.post('/donations', data);
    return response.data;
  },

  // Zenopay Payment Integration
  async initiateMobileMoneyPayment(data: ZenopayPaymentData): Promise<MobileMoneyPaymentResponse> {
    const response = await zenopayApi.post('/payments/mobile_money_tanzania', data);
    return response.data;
  },

  async checkPaymentStatus(orderId: string): Promise<any> {
    const response = await zenopayApi.get(`/payments/order-status/${orderId}`);
    return response.data;
  },

  // Currency Conversion
  async getCurrencyRate(): Promise<CurrencyRateInfo> {
    const response = await zenopayApi.get('/payments/currency/rate');
    return response.data;
  },

  async convertCurrency(data: CurrencyConversionData): Promise<any> {
    const response = await zenopayApi.post('/payments/currency/convert', data);
    return response.data;
  },
};

export default api;
