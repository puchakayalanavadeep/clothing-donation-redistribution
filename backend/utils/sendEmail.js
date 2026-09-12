const nodemailer = require('nodemailer');

/**
 * Send Email via SMTP using Nodemailer
 * @param {Object} options - { email, subject, message, html }
 */
const sendEmail = async (options) => {
  // Check if real SMTP credentials are provided in environment
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_MAIL || process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

  // Create Transporter
  let transporter;

  if (smtpUser && smtpPass) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  } else {
    // Development fallback transporter (log-only or Ethereal test account)
    console.log('⚠️ [SMTP Warning]: SMTP_MAIL / SMTP_PASSWORD not configured in .env. Simulating email send.');
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('--------------------------------------------------');
        console.log('📧 [SIMULATED EMAIL SENT VIA SMTP]:');
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Body: ${mailOptions.text || mailOptions.html}`);
        console.log('--------------------------------------------------');
        return { messageId: `simulated_${Date.now()}` };
      }
    };
  }

  const mailOptions = {
    from: `"${process.env.FROM_NAME || 'ReWear Connect'}" <${smtpUser || 'noreply@rewearconnect.org'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ [SMTP Success] Email dispatched to ${options.email}. Message ID: ${info.messageId}`);
  return info;
};

module.exports = sendEmail;
