const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = async (email, subject, text) => {
  // Configure your SMTP transporter here
  const transporter = nodemailer.createTransport({
    service: "Gmail", // e.g., 'Gmail', 'Yahoo', etc.
    auth: {
      user: process.env.GMAIL, // your email
      pass: process.env.GMAIL_PASS, // your email password or app password
    },
  });

  const mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: subject,
    text: text,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
