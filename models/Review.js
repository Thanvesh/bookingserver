const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookingProperty',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookingUser',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('BookingReview', reviewSchema);

module.exports = Review;
