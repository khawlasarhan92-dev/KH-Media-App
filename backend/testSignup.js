const axios = require('axios');

const run = async () => {
  try {
    const res = await axios.post('http://127.0.0.1:8000/api/v1/auth/signup', {
      username: 'auto-test',
      email: 'auto-test@example.com',
      password: 'Testing123!',
      passwordConfirm: 'Testing123!',
    }, {
      headers: { 'Content-Type': 'application/json' },
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
