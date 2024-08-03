const mongoose = require('mongoose');

const orderDetailsSchema = new mongoose.Schema({
  endDate: { type: Date, default: null },
  numAdults: { type: Number, required: true },
  numChildren: { type: Number, required: true },
  numDouble: { type: Number, required: true },
  numHours: { type: Number, default: null },
  numSingle: { type: Number, required: true },
  numTriple: { type: Number, required: true },
  propertyImages: [{ type: String, required: true }],
  propertyLocation: { type: String, required: true },
  propertyName: { type: String, required: true },
  startDate: { type: Date, required: true },
  stayType: { type: String, required: true },
  totalPrice: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'BookingUser', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'BookingProperty', required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  orderDetails: [orderDetailsSchema],
}, { timestamps: true });

const Order = mongoose.model('BookingOrder', orderSchema);
module.exports = Order;
