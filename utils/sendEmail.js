const nodemailer = require('nodemailer');

// Create a transporter object using your email service
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use other services like 'SendGrid', 'Mailgun', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

const sendEmail = async (options) => {
  // Define email options
  const mailOptions = {
    from: 'Your App Name <no-reply@yourapp.com>', // Sender address
    to: options.to, // List of recipients
    subject: options.subject, // Subject line
    text: options.text, // Plain text body
    html: options.html, // HTML body
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
