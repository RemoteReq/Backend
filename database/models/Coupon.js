// import DB connection
const mongoose = require('../mongoose.config.js');

const { Schema } = mongoose;

// DemoRequest Schema
const coupon = new Schema({
  code: { type: String, required: true },
  amount: { type: Number, required: true },
  discountType: { type: String, require: true },
  // expirationDate: { type: String },
  // dateAdded: { type: Date, default: Date.now }
});

// Model to export
const Coupon = mongoose.model('Coupon', coupon);


module.exports = Coupon;