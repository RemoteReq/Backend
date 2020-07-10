// import DB connection
const mongoose = require('../mongoose.config.js');

const { Schema } = mongoose;

// Employer Schema
const employerSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  // firstName: { type: String, required: true, unique: true },
  // lastName: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  authSignature: {type: String},
  companyName: { type: String },
  logo: { type: String },
  location: { type: String },
  isEmailVerify: { type: Boolean, default: false },
  isDeleteAccount: { type: Boolean, default: false },
});

// Model to export
const Employers = mongoose.model('Employers', employerSchema);


module.exports = Employers;