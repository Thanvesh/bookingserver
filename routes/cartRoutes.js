const express = require('express');
const {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getCart).post(protect, addItemToCart);
router.route('/item/:id').put(protect, updateCartItem).delete(protect, removeItemFromCart);

module.exports = router;
