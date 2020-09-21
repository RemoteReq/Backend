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
  // causesLikeToWorkOn: { type: Array },
  causes: { type: Array },
  // typeOfWork: { type: String }, // full-time/part-time
  jobType: { type: String }, // full-time/part-time
  // availableJoiningDate: { type: Date }, 
  soonestJoinDate: { type: Date }, 
  fluentInEnglish: { type: Boolean },

  highestEducationLevel: { type: Number },
  jobChangeReason: { type: String },
  // availableDaysForWork: { type: Array }, //for part-timer
  availableWorkDays: { type: Array }, //for part-timer
  // availableWorkTime: { type: String }, //for part-timer
  availableWorkHours: { type: String }, //for part-timer
  // selectTimeZone: { type: String }, //for part-timer
  timeZone: { type: String }, //for part-timer
  // hourlyPayExpectation: { type: Number }, //for part-timer
  hourlyWage: { type: Number }, //for part-timer
  // desireCTC: { type: Number }, //Annual salary Expectation for full-timer
  salary: { type: Number }, //Annual salary Expectation for full-timer
  projectDescription: { type: String },
  sampleProjectLink: { type: String },  
  relavantCertificates: { type: String },
  isWorkRemotely: { type: Boolean },
  descProfessionalGoal: { type: String },
  totalExperience: { type: Number }, 
  desireKeySkills: { type: Array }, 
  // desireLocation: { type: Array }, 
  location: { type: String }, 

  
  linkedInURL: { type: String },
  personalURL: { type: String },
  mobileNum: { type: String },
  howLongWorkingRemotely: { type: Number },
  otherLanguages: { type: Array },
  refferedBy: { type: String },
  gender: { type: String },
  race: { type: String },
  // veteranStatus: { type: String },
  veteranStatus: { type: Boolean },
  profilePicUrl: { type: String },
  isEmailVerify: { type: Boolean, default: false },
  isDeleteAccount: { type: Boolean, default: false },
  resumePath: { type: String },

  dob: { type: Date },
  address: { type: String },
  // pincode: { type: String },
  desireIndustryType: { type: String },
});

// Model to export
const User = mongoose.model('Users', userSchema);

module.exports = User;