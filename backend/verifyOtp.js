const axios = require('axios');

const run = async () => {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZjNmYWY1N2VhYzQ2YTRkYWFlZGI2NCIsImlhdCI6MTc2MDgxOTk2MCwiZXhwIjoxNzY4NTk1OTYwfQ.v5g7gFBUx9kWXLl9B3gUfX06eeJeFDXet4ODvp0iBF4';
    const otp = '981246';
    const res = await axios.post('http://127.0.0.1:8000/api/v1/auth/verify', { otp }, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
    });
    console.log('Status:', res.status);
    console.log('Data:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('Error response:', err.response.status, err.response.data);
    } else {
      console.error('Request error:', err.message);
    }
  }
};

run();
