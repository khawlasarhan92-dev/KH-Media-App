require('dotenv').config();
const sendEmail = require('./utils/email');

const run = async () => {
  try {
    const to = process.env.TEST_EMAIL || process.env.EMAIL;
    if (!to) {
      console.error('No recipient found. Set TEST_EMAIL or EMAIL in .env');
      process.exit(1);
    }
    await sendEmail({
      email: to,
      subject: 'Test email from media-app',
      html: `<p>This is a test email sent at ${new Date().toISOString()}</p>`,
    });
    console.log('Test email sent (check inbox/spam)');
    process.exit(0);
  } catch (err) {
    console.error('Test email failed:', err && err.message ? err.message : err);
    // Print nested info if available
    if (err && err.response) console.error('Response:', err.response);
    process.exit(2);
  }
};

run();
