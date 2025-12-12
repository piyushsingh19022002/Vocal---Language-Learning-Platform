const express = require('express');
const router = express.Router();

// @route POST /api/contact
// @desc  Submit contact form
// @access Public
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, category, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: 'Please fill in all required fields'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Please provide a valid email address'
      });
    }

    // Log the contact form submission (for now)
    const contactData = {
      name,
      email,
      subject,
      category: category || 'Not specified',
      message,
      timestamp: new Date().toISOString()
    };

    console.log('=== CONTACT FORM SUBMISSION ===');
    console.log('Name:', contactData.name);
    console.log('Email:', contactData.email);
    console.log('Subject:', contactData.subject);
    console.log('Category:', contactData.category);
    console.log('Message:', contactData.message);
    console.log('Timestamp:', contactData.timestamp);
    console.log('================================');

    // In the future, you can:
    // - Save to database
    // - Send email notification
    // - Integrate with email service (SendGrid, Mailgun, etc.)

    res.status(200).json({
      message: 'Thank you for contacting us! We will get back to you soon.',
      success: true
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      message: 'Server error. Please try again later.',
      success: false
    });
  }
});

module.exports = router;

