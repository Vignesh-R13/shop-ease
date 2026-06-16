const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// @desc    Get Razorpay public key
// @route   GET /api/config/razorpay
// @access  Private
router.get('/razorpay', protect, (req, res) => {
  res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID || 'placeholder_key'
  });
});

module.exports = router;
