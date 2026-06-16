const express = require('express');
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  verifyPayment
} = require('../controllers/orderController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .post(protect, addOrderItems)
  .get(protect, authorize('admin'), getOrders);

router.route('/myorders').get(protect, getMyOrders);
router.route('/verify').post(protect, verifyPayment);

router
  .route('/:id')
  .get(protect, getOrderById);

router
  .route('/:id/status')
  .put(protect, authorize('admin'), updateOrderStatus);

module.exports = router;
