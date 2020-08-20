// import DB connection
const mongoose = require('../mongoose.config.js');

const { Schema } = mongoose;

// User Schema
const userSchema = new Schema({
  username: { type: String, required: true },
  // firstName: { type: String, required: true },
  // lastName: { type: String, require: true },
  fullName: { type: String, require: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  authSignature: {type: String},
  fluentInEnglish: { type: Boolean },
  eligibleToWorkInUS: { type: Boolean },
  linkedInURL: { type: String },
  githubURL: { type: String },
  personalURL: { type: String },
  profilePicUrl: { type: String },
  mobileNum: { type: String },
  gender: { type: String },
  dob: { type: Date },
  address: { type: String },
  pincode: { type: String },
  aboutMe: { type: String },
  refferedBy: { type: String },
  industryType: { type: String },
  jobRole: { type: String },
  currentCTC: { type: Number },
  totalExperience: { type: Number },
  keySkills: { type: Array },
  education: { type: Array },
  desireIndustryType: { type: String },
  desireJobRole: { type: String },
  desireCTC: { type: Number },
  desireLocation: { type: Array },
  desireKeySkills: { type: Array },
  isEmailVerify: { type: Boolean, default: false },
  isDeleteAccount: { type: Boolean, default: false },
  resumePath: { type: String },
});

// Model to export
const User = mongoose.model('Users', userSchema);

module.exports = User;