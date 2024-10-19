const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Email sending logic
router.post('/send-email', async (req, res) => {
  const { supplierEmail, productName, quantity, shipmentPort } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',  // Your email address
      pass: 'your-email-password',   // Your email password
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: supplierEmail,
    subject: `Reorder Request for ${productName}`,
    text: `Hello, we would like to reorder ${quantity} units of ${productName} to be shipped to ${shipmentPort}.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    res.status(500).send('Error sending email');
  }
});

module.exports = router;
