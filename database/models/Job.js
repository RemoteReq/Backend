// import DB connection
const mongoose = require('../mongoose.config.js');

const { Schema } = mongoose;

// Job Schema
const jobSchema = new Schema({
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  companyLogoPath: { type: String},
  companyWebsiteUrl: { type: String},
  industryType: { type: String, required: true },
  jobDetails: { type: String, require: true },
  jobDescriptionPath: { type: String },
  numberOfCandidate: {type: Number, required: true},
  percentageMatch: {type: Number, required: true},
  addBy: { type: String, required: true },
  postDate: { type: Date, default: Date.now },
  expireDate: { type: Date, default: new Date(+new Date() + 21*24*60*60*1000) },
  // expireDate: { type: Date, default: new Date(+new Date() + 1*60*60*1000) },
  expireStatus: { type: Boolean, default: false},
  seventhDayAfterExpireDate: { type: Date, default: new Date(+new Date() + 28*24*60*60*1000) },
  // seventhDayAfterExpireDate: { type: Date, default: new Date(+new Date() + 2*60*60*1000) },
  hiredStatus: { type: Boolean, default: null}, 
  hiringPaymentStatus: {type: Boolean, default: null}, // true: paid, false: not paid
  transactionDetails: {
    transactionIdForAddJob: { // using for first payment
      // transactionId: { type: String, required: true }
      transactionId: { type: String }
    },
    transactionIdAfterHired: { // using for second payment
      transactionId: { type: String }
    }
  },
  matchesCandidateFlag: {type: Boolean, default: false},
  matchesCandidateCount: {type: Number, default: 0},

  eligibleToWorkInUS: { type: Boolean },
  cause: { type: String },
  jobType: { type: String }, // full-time/part-time
  soonestJoinDate: { type: Date }, 
  fluentInEnglish: { type: Boolean },

  requiredEducationLevel: { type: Number },
  workDays: { type: Array }, 
  workHours: { type: String }, 
  timeZone: { type: String },
  hourlyWage: { type: Number}, //for part-timer
  salary: { type: Number, required: true }, // for full-timer
  requireCertification: { type: String },
  otherLanguages: { type: Array },
  minExperience: {type: Number, required: true},
  maxExperience: { type: Number, required: true },
  keySkills: { type: Array, required: true },
  location: { type: String, required: true },
  
});

// Model to export
const Jobs = mongoose.model('Jobs', jobSchema);


module.exports = Jobs;