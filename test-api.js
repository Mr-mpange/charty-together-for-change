// Test script to verify API connectivity
// Run this in your browser console or as a Node.js script

const API_BASE_URL = 'https://charity-backend-for-test.vercel.app/api';

async function testAPI() {
  console.log('🧪 Testing API Connectivity...\n');

  const tests = [
    {
      name: 'Contact Form Test',
      test: async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: 'Test User',
              email: 'test@example.com',
              message: 'This is a test message'
            })
          });

          if (response.ok) {
            return { success: true, message: 'Contact form endpoint is working!' };
          } else {
            return { success: false, message: `Contact form failed: ${response.status}` };
          }
        } catch (error) {
          return { success: false, message: `Contact form error: ${error.message}` };
        }
      }
    },
    {
      name: 'Health Check',
      test: async () => {
        try {
          const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/health`);
          if (response.ok) {
            return { success: true, message: 'Backend is healthy!' };
          } else {
            return { success: false, message: `Health check failed: ${response.status}` };
          }
        } catch (error) {
          return { success: false, message: `Health check error: ${error.message}` };
        }
      }
    }
  ];

  for (const test of tests) {
    console.log(`⏳ Running: ${test.name}`);
    const result = await test.test();
    console.log(`${result.success ? '✅' : '❌'} ${result.message}`);
  }

  console.log('\n📋 Next Steps:');
  console.log('1. If tests pass: Deploy your frontend to Vercel');
  console.log('2. If tests fail: Deploy your backend first');
  console.log('3. Check Vercel dashboard for deployment status');
}

// Run the test
testAPI().catch(console.error);
