const express = require('express');
const {
  createReview,
  getReviewsForProperty,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to create a review
router.route('/').post(protect, createReview);

// Route to get all reviews for a property
router.route('/property/:id').get(getReviewsForProperty);

// Route to update and delete a review
router
  .route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
