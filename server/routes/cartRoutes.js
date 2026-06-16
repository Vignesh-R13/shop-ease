const express = require('express');
const { getCart, saveCart } = require('../controllers/cartController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getCart)
  .post(protect, saveCart);

module.exports = router;
