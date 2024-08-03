const express = require('express');
const {
  getUserOrders,
  createOrder,
  cancelUserOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getUserOrders).post(protect, createOrder);
router
  .route('/:id')
  .delete(protect, cancelUserOrder);

module.exports = router;
