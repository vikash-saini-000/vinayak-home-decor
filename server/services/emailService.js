const nodemailer = require('nodemailer');
const { welcomeTemplate, mutualCrushTemplate, matchRevealedTemplate } = require('../templates/emailTemplates');

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email credentials not configured, skipping email send.');
      return;
    }

    const mailOptions = {
      from: `"Campus Crush" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await getTransporter().sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
  }
};

const sendWelcomeEmail = async (user) => {
  const html = welcomeTemplate(user.name);
  await sendEmail(user.email, 'Welcome to Campus Crush 💫', html);
};

const sendMutualCrushEmail = async (user) => {
  const html = mutualCrushTemplate(user.name);
  await sendEmail(user.email, 'Someone you like feels the same way 👀', html);
};

const sendMatchRevealedEmail = async (user, matchName) => {
  const html = matchRevealedTemplate(user.name, matchName);
  await sendEmail(user.email, "It's a match! 🎉", html);
};

module.exports = { sendWelcomeEmail, sendMutualCrushEmail, sendMatchRevealedEmail };
