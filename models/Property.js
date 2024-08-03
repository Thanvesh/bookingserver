const mongoose = require('mongoose');

const propertySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    location:{type:String, required:true},
    description: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    pricePer6Hours: { type: Number, required: true },
    rooms: {
      single: { type: Number, default: 0 },
      double: { type: Number, default: 0 },
      triple: { type: Number, default: 0 },
    },
    available: { type: Boolean, default: true },
    imageUrls: [{ type: String }], // Array of strings to hold multiple image URLs
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BookingUser' }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BookingReview' }],
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model('BookingProperty', propertySchema);

module.exports = Property;
