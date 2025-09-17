# Backend Integration Guide

This document explains how the frontend application has been connected to backend APIs and how to set up the backend integration.

## Overview

The frontend application has been updated to connect to backend APIs for:
- Contact form submissions
- Donation processing
- Dynamic content loading (leaders, gallery, services, about section)
- Impact statistics

## What's Been Implemented

### 1. API Service Layer (`src/lib/api.ts`)
- Axios-based HTTP client with interceptors
- TypeScript interfaces for all API data structures
- Centralized API configuration
- Error handling and authentication support

### 2. React Query Hooks (`src/hooks/use-api.ts`)
- Custom hooks for data fetching with React Query
- Mutation hooks for form submissions
- Automatic caching and background refetching
- Loading and error states

### 3. Component Updates
All major components have been updated to use backend data:

#### ContactSection
- ✅ Connected to `/api/contact` endpoint
- ✅ Form validation and submission
- ✅ Loading states and error handling

#### DonateSection
- ✅ Connected to `/api/donations` endpoint
- ✅ Dynamic impact statistics from `/api/impact-stats`
- ✅ Form validation and submission
- ✅ Loading states and error handling

#### LeadersSection
- ✅ Connected to `/api/leaders` endpoint
- ✅ Fallback to local data if API unavailable
- ✅ Loading states

#### GallerySection
- ✅ Connected to `/api/gallery` endpoint
- ✅ Fallback to local data if API unavailable
- ✅ Loading states

#### ServicesSection
- ✅ Connected to `/api/services` endpoint
- ✅ Connected to `/api/impact-stats` endpoint
- ✅ Fallback to local data if API unavailable
- ✅ Loading states

#### AboutSection
- ✅ Connected to `/api/about` endpoint
- ✅ Dynamic mission, vision, and values
- ✅ Fallback to local data if API unavailable
- ✅ Loading states

## Configuration

### Environment Variables
Create a `.env.local` file in your project root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api

# Environment
VITE_NODE_ENV=development

# Optional: Payment Gateway Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id_here

# Optional: Analytics
VITE_GOOGLE_ANALYTICS_ID=your_ga_id_here
```

### API Configuration (`src/lib/config.ts`)
The application uses a centralized configuration system that reads from environment variables with sensible defaults.

## Backend Requirements

The frontend expects the following API endpoints:

### Base URL
```
http://localhost:3001/api
```

### Required Endpoints

1. **POST** `/contact` - Contact form submission
2. **POST** `/donations` - Donation processing
3. **GET** `/leaders` - Leadership team data
4. **GET** `/gallery` - Gallery images and metadata
5. **GET** `/services` - Services information
6. **GET** `/about` - About section content
7. **GET** `/impact-stats` - Impact statistics

See `backend-api-example.md` for detailed API documentation and example implementations.

## Fallback Strategy

The application implements a robust fallback strategy:

1. **Primary**: Attempt to fetch data from backend API
2. **Fallback**: Use local hardcoded data if API is unavailable
3. **Error Handling**: Graceful degradation with user-friendly error messages
4. **Loading States**: Show loading indicators while fetching data

This ensures the application remains functional even when the backend is not available.

## Development Workflow

### 1. Start Backend Server
```bash
# In your backend project
npm start
# or
node server.js
```

### 2. Start Frontend Development Server
```bash
# In your frontend project
npm run dev
```

### 3. Test API Integration
- Open browser developer tools
- Check Network tab for API calls
- Verify data is being fetched from backend
- Test form submissions

## Production Deployment

### Frontend
1. Set production API URL in environment variables
2. Build the application: `npm run build`
3. Deploy to your hosting platform

### Backend
1. Set up production database
2. Configure environment variables
3. Deploy to your server/cloud platform
4. Ensure CORS is configured for your frontend domain

## Error Handling

The application handles various error scenarios:

- **Network Errors**: Shows fallback data and logs warning
- **API Errors**: Displays user-friendly error messages
- **Validation Errors**: Shows specific field validation messages
- **Timeout Errors**: Retries with exponential backoff

## Testing

### Manual Testing
1. Test with backend running (normal flow)
2. Test with backend stopped (fallback flow)
3. Test form submissions
4. Test error scenarios

### Automated Testing
Consider adding tests for:
- API service functions
- React Query hooks
- Component error states
- Form validation

## Security Considerations

1. **API Keys**: Store sensitive keys in environment variables
2. **CORS**: Configure CORS properly for production
3. **Input Validation**: Validate all user inputs on backend
4. **Rate Limiting**: Implement rate limiting on API endpoints
5. **HTTPS**: Use HTTPS in production

## Performance Optimizations

1. **Caching**: React Query provides automatic caching
2. **Prefetching**: Data can be prefetched for better UX
3. **Lazy Loading**: Components load data only when needed
4. **Error Boundaries**: Implement error boundaries for better error handling

## Monitoring

Consider implementing:
- API response time monitoring
- Error rate tracking
- User interaction analytics
- Performance metrics

## Support

If you encounter issues with the backend integration:

1. Check browser developer tools for network errors
2. Verify backend server is running and accessible
3. Check environment variables are set correctly
4. Review API endpoint responses
5. Check CORS configuration

The application is designed to be resilient and will continue to work with fallback data even if the backend is temporarily unavailable.
