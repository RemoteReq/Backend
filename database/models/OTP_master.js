// import DB connection
const mongoose = require('../mongoose.config.js');

const { Schema } = mongoose;

// OTP Schema
const OTPSchema = new Schema({
  OTP: { type: Number, required: true},
  emailId: { type: String, required: true },
  // status: { type: Number, default: 0 }  // 0: not verified, 1: verified 
});

// Model to export
const OTP_master = mongoose.model('OTP_master', OTPSchema);


module.exports = OTP_master;