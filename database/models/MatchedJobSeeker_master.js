// import DB connection
const mongoose = require('../mongoose.config.js');

const { Schema } = mongoose;


const matchedJobSeekerSchema = new Schema({
  fullName: { type: String },
  email: { type: String },
  eligibleToWorkInUS: { type: Boolean },
  causes: { type: Array },
  jobType: { type: String }, // full-time/part-time
  soonestJoinDate: { type: Date }, 
  fluentInEnglish: { type: Boolean },
  highestEducationLevel: { type: Number },
  jobChangeReason: { type: String },
  availableWorkDays: { type: Array }, //for part-timer
  availableWorkHours: { type: String }, //for part-timer
  timeZone: { type: String }, //for part-timer
  hourlyWage: { type: Number }, //for part-timer
  salary: { type: Number }, //Annual salary Expectation for full-timer
  projectDescription: { type: String },
  sampleProjectLink: { type: String },  
  relavantCertificates: { type: String },
  isWorkRemotely: { type: Boolean },
  descProfessionalGoal: { type: String },
  totalExperience: { type: Number }, 
  desireKeySkills: { type: Array }, 
  location: { type: String },
  linkedInURL: { type: String },
  personalURL: { type: String },
  mobileNum: { type: String },
  howLongWorkingRemotely: { type: Number },
  otherLanguages: { type: Array },
  refferedBy: { type: String },
  gender: { type: String },
  race: { type: String },
  veteranStatus: { type: Boolean },
  profilePicUrl: { type: String },
  resumePath: { type: String },
  dob: { type: Date },
  address: { type: String },
  desireIndustryType: { type: String },
  matchingPercentage: { type: Number },
  jobId: { type: String },
  candidateId: { type: String },
});

// Model to export
const MatchedJobSeeker_Master = mongoose.model('MatchedJobSeeker_Master', matchedJobSeekerSchema);


module.exports = MatchedJobSeeker_Master;