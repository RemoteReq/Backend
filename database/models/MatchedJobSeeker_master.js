// import DB connection
const mongoose = require('../mongoose.config.js');

const { Schema } = mongoose;


const matchedJobSeekerSchema = new Schema({
  fullName: { type: String },
  email: { type: String },
  title: { type: Array },
  location: { type: String },
  availability: { type: Array },
  causes: { type: Array },
  jobType: { type: Array }, // full-time/part-time
  soonestJoinDate: { type: Date }, 
  fluentInEnglish: { type: Boolean },
  eligibleToWorkInUS: { type: Boolean },
  highestEducationLevel: { type: Number },
  reasonForCause: { type: String },
  availableWorkHours: { type: Number }, //for part-timer
  timeZone: { type: String }, //for part-timer
  hourlyWage: { type: Number }, //for part-timer
  salary: { type: Number }, //Annual salary Expectation for full-timer
  projectDescription: { type: String },
  sampleProjectLink: { type: String },  
  relavantCertificates: { type: String },
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
  resumePath: { type: String },
  // address: { type: String },
  zipcode: { type: String },
  matchingPercentage: { type: Number },
  jobId: { type: String },
  candidateId: { type: String },
});

// Model to export
const MatchedJobSeeker_Master = mongoose.model('MatchedJobSeeker_Master', matchedJobSeekerSchema);


module.exports = MatchedJobSeeker_Master;