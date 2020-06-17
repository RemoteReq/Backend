// import DB connection
const mongoose = require('../mongoose.config.js');

const { Schema } = mongoose;

// Employer Schema
const employerSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  authSignature: {type: String},
  companyName: { type: String },
  logo: { type: String },
  location: { type: String }
});

// Model to export
const Employers = mongoose.model('Employers', employerSchema);


module.exports = Employers;