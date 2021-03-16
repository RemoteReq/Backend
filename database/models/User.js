// import DB connection
const mongoose = require('../mongoose.config.js');

const { Schema } = mongoose;

// User Schema
const userSchema = new Schema({
  // username: { type: String, required: true },
  username: { type: String },
  fullName: { type: String, require: true },
  // password: { type: String, required: true },
  password: { type: String },
  email: { type: String, required: true },
  authSignature: {type: String},

  title: { type: Array }, //new field. should be Array
  location: { type: String },
  zipcode: { type: String },
  availability: { type: String, enum : ['Remote','On-site', 'Flexible', ''] }, //new field
  causes: { type: Array },
  jobType: { type: String, enum : ['Full Time','Part Time', ''] }, // full-time/part-time
  
  soonestJoinDate: { type: Date }, 
  fluentInEnglish: { type: Boolean },
  eligibleToWorkInUS: { type: Boolean },

  highestEducationLevel: { type: Number },
  reasonForCause: { type: String },
  availableWorkHours: { type: String }, //for part-timer
  timeZone: { type: String }, //for part-timer
  hourlyWage: { type: Number }, //for part-timer
  salary: { type: Number }, //Annual salary Expectation for full-timer
  projectDescription: { type: String },
  sampleProjectLink: { type: String },  
  relavantCertificates: { type: String },
  // isWorkRemotely: { type: Boolean },
  aboutMe: { type: String },
  totalExperience: { type: Number }, 
  desireKeySkills: { type: Array },  
  
  linkedInURL: { type: String },
  personalURL: { type: String },
  mobileNum: { type: String },
  howLongWorkingRemotely: { type: Number },
  otherLanguages: { type: Array },
  refferedBy: { type: String },
  profilePicUrl: { type: String },
  isEmailVerify: { type: Boolean, default: false },
  isDeleteAccount: { type: Boolean, default: false },
  resumePath: { type: String },
  profileCompleteStatus: { type: Boolean, default: false },

  // address: { type: String },
});

// Model to export
const User = mongoose.model('Users', userSchema);

module.exports = User;