const express = require('express');
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  toggleFavorite,
  getFavoriteProperties,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');

const {isAdmin}= require('../middleware/adminMiddleware');

const router = express.Router();

router.route('/').get(getProperties).post(protect,isAdmin, createProperty);
router
  .route('/:id')
  .get(getPropertyById)
  .put(protect,isAdmin, updateProperty)
  .delete(protect,isAdmin, deleteProperty);

// Route to toggle favorite status
router.route('/:id/favorite').put(protect, toggleFavorite);
router.route('/:id/favorites').get(protect, getFavoriteProperties);

module.exports = router;
