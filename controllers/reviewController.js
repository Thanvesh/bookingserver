const Review = require('../models/Review');
const Property = require('../models/Property');

// Create a review
const createReview = async (req, res) => {
  try {
    const { propertyId, rating, comment } = req.body;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Create and save review
    const review = new Review({
      property: propertyId,
      user: req.user._id,
      rating,
      comment,
    });

    const createdReview = await review.save();

    // Update property with new review
    property.reviews.push(createdReview._id);
    await property.save();

    res.status(201).json(createdReview);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all reviews for a property
const getReviewsForProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;

    // Get reviews
    const reviews = await Review.find({ property: propertyId }).populate('user', 'name');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { rating, comment } = req.body;

    // Find and update review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure user is the author of the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    const updatedReview = await review.save();

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    // Find and delete review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure user is the author of the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await review.remove();

    // Remove review reference from property
    await Property.findByIdAndUpdate(
      review.property,
      { $pull: { reviews: reviewId } },
      { new: true }
    );

    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createReview,
  getReviewsForProperty,
  updateReview,
  deleteReview,
};
