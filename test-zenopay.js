const axios = require('axios');

// Test the Zenopay API endpoints
async function testZenopayAPI() {
  try {
    console.log('🔍 Testing Zenopay API endpoints...');

    // Test 1: Check if server is running
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('✅ Zenopay API server is running:', healthResponse.data);

    // Test 2: Test mobile money payment initiation
    const paymentResponse = await axios.post('http://localhost:3000/api/payments/mobile_money_tanzania', {
      buyerName: 'Test User',
      buyerPhone: '+255123456789',
      buyerEmail: 'test@example.com',
      amount: 1000,
      currency: 'TZS',
      webhookUrl: 'http://localhost:3000/api/webhooks/zenopay',
      metadata: { test: true }
    }, {
      headers: {
        'x-api-key': 'B9BZn8ZoXj4vX0gan_3KPi3Sv9tAwus1eW4H3APKxK6le1abc7CFqsDwhUXVKFHYuk3p4JQWIdk-gusEBfAwXw'
      }
    });

    console.log('✅ Mobile money payment initiated:', paymentResponse.data);

    // Test 3: Test webhook processing
    const webhookResponse = await axios.post('http://localhost:3000/api/webhooks/zenopay', {
      order_id: paymentResponse.data.order_id || 'test_order_123',
      payment_status: 'COMPLETED',
      reference: 'TEST_REF_123',
      transaction_id: 'TXN_TEST_123',
      metadata: { test: true }
    });

    console.log('✅ Webhook processed successfully:', webhookResponse.data);

    console.log('🎉 All tests passed! Zenopay integration is working.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the Zenopay API server is running on port 3000');
    }
  }
}

testZenopayAPI();
