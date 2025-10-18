const axios = require('axios');

const run = async () => {
  try {
    const token = process.env.TEST_TOKEN;
    const otp = process.env.TEST_OTP;
    if (!token || !otp) {
      console.error('Missing TEST_TOKEN or TEST_OTP in environment — set them before running this script.');
      return;
    }
    const res = await axios.post('http://127.0.0.1:8000/api/v1/auth/verify', { otp }, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
    });
    console.log('Status:', res.status);
    // print minimal response to avoid exposing tokens
    console.log('Message:', res.data && res.data.message ? res.data.message : 'No message');
  } catch (err) {
    if (err.response) {
      console.error('Error response:', err.response.status, err.response.data && err.response.data.message ? err.response.data.message : 'No message');
    } else {
      console.error('Request error:', err.message);
    }
  }
};

run();
