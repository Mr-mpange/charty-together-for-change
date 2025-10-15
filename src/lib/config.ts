// Application Configuration
export const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://charity-backend-for-test.vercel.app/api',
    timeout: 10000,
  },
  
  // Environment
  env: import.meta.env.VITE_NODE_ENV || 'development',
  
  // Payment Gateways (Optional)
  payments: {
    stripe: {
      publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    },
    paypal: {
      clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
    },
    zenopay: {
      baseURL: import.meta.env.VITE_ZENOPAY_BASE_URL || 'https://charity-backend-for-test.vercel.app/api',
      apiKey: import.meta.env.VITE_ZENOPAY_API_KEY || '',
    },
  },
  
  // Analytics (Optional)
  analytics: {
    googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '',
  },
  
  // App Settings
  app: {
    name: 'Charty Events',
    version: '1.0.0',
    contactEmail: 'kilindosaid771@gmail.com',
    phone: '0683859574',
    // Floating actions & integrations
    // wa.me requires digits only
    whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER || '+255123456789').replace(/[^0-9]/g, ''),
    whatsappMessage: import.meta.env.VITE_WHATSAPP_MESSAGE || "Hello! I'm interested in learning more about Charty Events.",
    aiBotEnabled: (import.meta.env.VITE_AI_BOT_ENABLED || 'true') === 'true',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  },

  // Social Media Links
  social: {
    facebook: import.meta.env.VITE_FACEBOOK_URL || 'https://facebook.com/your-page',
    twitter: import.meta.env.VITE_TWITTER_URL || 'https://twitter.com/your-handle',
    linkedin: import.meta.env.VITE_LINKEDIN_URL || 'https://linkedin.com/company/your-company',
    instagram: import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/your-handle',
  },
};

export default config;
