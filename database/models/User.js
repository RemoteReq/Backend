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
  
  eligibleToWorkInUS: { type: Boolean },
  causesLikeToWorkOn: { type: Array },
  typingWork: { type: String }, // full-time/part-time
  availableJoiningDate: { type: Date }, 
  fluentInEnglish: { type: Boolean },

  highestEducation: { type: String },
  jobChangeReason: { type: String },
  availableDaysForWork: { type: String }, //for part-timer
  availableWorkTime: { type: String }, //for part-timer
  selectTimeZone: { type: String },
  hourlyPayExpectation: { type: Number }, //for part-timer
  desireCTC: { type: Number }, //Annual salary Expectation for full-timer
  projectDescription: { type: String },
  sampleProjectLink: { type: String },  //issue for upload
  relavantCertificates: { type: String },
  isWorkRemotely: { type: Boolean },
  descProfessionalGoal: { type: String },
  totalExperience: { type: Number }, 
  desireKeySkills: { type: Array }, 
  desireLocation: { type: Array }, 

  
  linkedInURL: { type: String },
  personalURL: { type: String },
  mobileNum: { type: String },
  howLongWorkingRemotely: { type: Number },
  otherLanguages: { type: Array },
  refferedBy: { type: String },
  gender: { type: String },
  race: { type: String },
  veteranStatus: { type: String },
  profilePicUrl: { type: String },
  isEmailVerify: { type: Boolean, default: false },
  isDeleteAccount: { type: Boolean, default: false },
  resumePath: { type: String },

  // githubURL: { type: String },
  // education: { type: Array },
  dob: { type: Date },
  address: { type: String },
  pincode: { type: String },
  // aboutMe: { type: String },
  // industryType: { type: String },
  // jobRole: { type: String },
  // currentCTC: { type: Number },
  // keySkills: { type: Array },
  desireIndustryType: { type: String },
  // desireJobRole: { type: String },
  
});

// Model to export
const User = mongoose.model('Users', userSchema);

module.exports = User;