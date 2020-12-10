// import DB connection
const mongoose = require('../mongoose.config.js');

const { Schema } = mongoose;

// Subscriber Schema
const subscriberSchema = new Schema({
  emailId: { type: String, required: true },
  name: { type: String, required: true },
  companyName: { type: String },
  phoneNumber: { type: String },
  updated: { type: Date, default: Date.now }
});

// Model to export
const Subscriber = mongoose.model('Subscriber', subscriberSchema);


module.exports = Subscriber;