const axios = require('axios');

// Test the complete Zenopay payment integration
async function testZenopayIntegration() {
  try {
    console.log('🧪 Testing Zenopay Payment Integration...\n');

    // Test 1: Check if backend server is running
    console.log('1️⃣ Testing backend server...');
    try {
      const healthResponse = await axios.get('http://localhost:3001/api/health');
      console.log('✅ Backend server is running');
    } catch (error) {
      console.log('❌ Backend server not running. Please start it with: npm run start:backend');
      return;
    }

    // Test 2: Test payment methods endpoint
    console.log('\n2️⃣ Testing payment methods...');
    try {
      const methodsResponse = await axios.get('http://localhost:3001/api/payments/methods');
      console.log('✅ Payment methods endpoint working');
      console.log('Available methods:', methodsResponse.data.methods.map(m => m.name).join(', '));
    } catch (error) {
      console.log('❌ Payment methods endpoint failed:', error.message);
    }

    // Test 3: Test mobile money payment initiation
    console.log('\n3️⃣ Testing mobile money payment...');
    try {
      const paymentResponse = await axios.post('http://localhost:3001/api/payments/mobile_money_tanzania', {
        buyerName: 'Test User',
        buyerPhone: '+255123456789',
        buyerEmail: 'test@example.com',
        amount: 1000,
        currency: 'TZS',
        metadata: {
          donationType: 'one-time',
          zenoId: 'zp60679713'
        }
      });

      console.log('✅ Mobile money payment initiated successfully');
      console.log('Order ID:', paymentResponse.data.data.orderId);
      console.log('Status:', paymentResponse.data.data.paymentStatus);
    } catch (error) {
      console.log('❌ Mobile money payment failed:', error.response?.data?.message || error.message);
    }

    // Test 4: Test webhook endpoint
    console.log('\n4️⃣ Testing webhook endpoint...');
    try {
      const webhookResponse = await axios.post('http://localhost:3001/api/webhooks/zenopay', {
        order_id: 'test_order_123',
        payment_status: 'COMPLETED',
        reference: 'TEST_REF_123',
        transaction_id: 'TXN_TEST_123',
        metadata: { test: true }
      });

      console.log('✅ Webhook endpoint working');
      console.log('Response:', webhookResponse.data.message);
    } catch (error) {
      console.log('❌ Webhook endpoint failed:', error.response?.data?.message || error.message);
    }

    // Test 5: Test payment status check
    console.log('\n5️⃣ Testing payment status check...');
    try {
      const statusResponse = await axios.get('http://localhost:3001/api/payments/order-status/test_order_123');
      console.log('✅ Payment status check working');
      console.log('Status:', statusResponse.data.paymentStatus);
    } catch (error) {
      console.log('❌ Payment status check failed:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 Zenopay integration test completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Start your backend server: cd backend && npm start');
    console.log('2. Start your frontend: npm run dev');
    console.log('3. Test payments through the donation form');
    console.log('4. Monitor console logs for webhook notifications');

  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
  }
}

testZenopayIntegration();
