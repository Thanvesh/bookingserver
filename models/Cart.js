// models/Cart.js

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'BookingProperty'},
  propertyName: { type: String, required: true },
  propertyImages: [{ type: String }], // Array of image URLs
  propertyLocation: { type: String, required: true },
  numAdults: { type: Number, required: true },
  numChildren: { type: Number, required: true },
  numSingle: { type: Number, required: true },
  numDouble: { type: Number, required: true },
  numTriple: { type: Number, required: true },
  stayType: { type: String, enum: ['night', 'day', 'hours'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  numHours: { type: Number },
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'BookingUser', required: true },
  items: [cartItemSchema],
}, { timestamps: true });

const Cart = mongoose.model('BookingCart', cartSchema);
module.exports = Cart;
