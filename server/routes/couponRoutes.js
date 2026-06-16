const express = require('express');
const {
  validateCoupon,
  getCoupons,
  createCoupon,
  deleteCoupon
} = require('../controllers/couponController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Validation route for users checking out
router.post('/validate', protect, validateCoupon);

// Administrative routes
router
  .route('/')
  .get(protect, authorize('admin'), getCoupons)
  .post(protect, authorize('admin'), createCoupon);

router
  .route('/:id')
  .delete(protect, authorize('admin'), deleteCoupon);

module.exports = router;
