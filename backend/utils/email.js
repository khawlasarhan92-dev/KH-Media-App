const nodemailer = require('nodemailer');

const sendEmail = async(options) =>{
  const transporter = nodemailer.createTransport({
     host: 'smtp.gmail.com', 
    port: 465, 
    secure: true,
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
  await transporter.sendMail(mailOptions);
};

module.exports= sendEmail;
