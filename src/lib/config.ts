// Application Configuration
export const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
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
};

export default config;
