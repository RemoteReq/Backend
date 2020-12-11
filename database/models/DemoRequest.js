// import DB connection
const mongoose = require('../mongoose.config.js');

const { Schema } = mongoose;

// DemoRequest Schema
const demoRequestSchema = new Schema({
  emailId: { type: String, required: true },
  name: { type: String, required: true },
  companyName: { type: String },
  phoneNumber: { type: String },
  updated: { type: Date, default: Date.now }
});

// Model to export
const DemoRequest = mongoose.model('DemoRequest', demoRequestSchema);


module.exports = DemoRequest;