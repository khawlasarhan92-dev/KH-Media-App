const nodemailer = require('nodemailer');

const sendEmail = async(options) =>{
  const transporter = nodemailer.createTransport({
     host: 'smtp.gmail.com', 
    port: 587, 
    secure: false, 
    requireTLS: true,
    auth:{
      user:process.env.EMAIL,
      pass:process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from:`"media-app" Share Your Imagination`,
    to:options.email,
    subject:options.subject,
    html:options.html,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Email send error:', {
      message: err.message,
      code: err.code,
      response: err.response,
      stack: err.stack
    });
    throw err;
  }
};

module.exports= sendEmail;
