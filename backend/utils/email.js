const nodemailer = require('nodemailer');
const emailLogger = require('./emailLogger');

const sendEmail = async(options) =>{
  let transporterConfig;
  if (process.env.MAILJET_API_KEY && process.env.MAILJET_API_SECRET) {
    // We'll use Mailjet HTTP API when keys are present for more reliable delivery and reporting
    transporterConfig = { provider: 'mailjet-http' };
  } else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporterConfig = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };
  } else {
    // For Gmail, remove any accidental spaces (Google shows app passwords with spaces)
    const gmailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : undefined;
    transporterConfig = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL,
        pass: gmailPass,
      },
    };
  }
  const transporter = transporterConfig.provider === 'mailjet-http' ? null : nodemailer.createTransport(transporterConfig);
  const mailOptions = {
    // include a valid sender address when possible (some SMTP providers require it)
    from: process.env.EMAIL ? `"media-app" <${process.env.EMAIL}>` : '"media-app" Share Your Imagination',
    to:options.email,
    subject:options.subject,
    html:options.html,
  };
  // If SEND_EMAILS is set to 'false', skip actual sending (useful for tests/demo)
  if (process.env.SEND_EMAILS === 'false') {
    console.log('SEND_EMAILS is false — skipping email send.');
    emailLogger.append({ event: 'skipped', to: mailOptions.to, reason: 'SEND_EMAILS=false' });
    return;
  }

  const maxRetries = process.env.EMAIL_MAX_RETRIES ? parseInt(process.env.EMAIL_MAX_RETRIES, 10) : 2;
  let attempt = 0;
  // verify connection configuration (useful in logs) - only for transporter-based providers
  if (transporter) {
    transporter.verify((verifyErr, success) => {
      if (verifyErr) {
        console.error('Transporter verify error:', verifyErr);
      } else {
        console.log('Transporter is ready to send messages');
      }
    });
  }

  while (attempt <= maxRetries) {
    try {
      attempt += 1;
      console.log(`Attempt ${attempt} to send email to ${mailOptions.to}`);
      emailLogger.append({ event: 'attempt', attempt, to: mailOptions.to });
      if (transporterConfig.provider === 'mailjet-http') {
        // send via Mailjet HTTP API
        const axios = require('axios');
        const auth = Buffer.from(`${process.env.MAILJET_API_KEY}:${process.env.MAILJET_API_SECRET}`).toString('base64');
        const body = {
          Messages: [
            {
              From: {
                Email: process.env.EMAIL || 'no-reply@yourdomain.com',
                Name: 'media-app',
              },
              To: [
                {
                  Email: mailOptions.to,
                },
              ],
              Subject: mailOptions.subject,
              HTMLPart: mailOptions.html,
            },
          ],
        };
        const resp = await axios.post('https://api.mailjet.com/v3.1/send', body, {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        });
        // Mailjet returns info about sent messages
        emailLogger.append({ event: 'sent', attempt, to: mailOptions.to, mailjet: resp.data });
        console.log('Email sent successfully via Mailjet on attempt', attempt);
        return;
      }
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully on attempt', attempt);
      emailLogger.append({ event: 'sent', attempt, to: mailOptions.to });
      return;
    } catch (err) {
      console.error(`Email send error on attempt ${attempt}:`, err && err.message ? err.message : err);
      // If max attempts reached, throw detailed info
      if (attempt > maxRetries) {
        const full = {
          message: err.message,
          code: err.code,
          response: err.response,
          stack: err.stack,
          transporterConfig: {
            host: transporterConfig.host,
            port: transporterConfig.port,
            secure: transporterConfig.secure,
          },
        };
        console.error('Max email send attempts reached. Full error object:', full);
        emailLogger.append({ event: 'failed', attempt, to: mailOptions.to, error: full });
        throw err;
      }
      // simple backoff before retrying
      const backoffMs = attempt * 500;
      await new Promise((r) => setTimeout(r, backoffMs));
    }
  }
};

module.exports= sendEmail;
