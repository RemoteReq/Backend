// import DB connection
const mongoose = require('../mongoose.config.js');

const { Schema } = mongoose;

// Job Schema
const jobSchema = new Schema({
  companyName: { type: String, required: true },
  companyLogoPath: { type: String},
  companyWebsiteUrl: { type: String},
  aboutUs: { type: String },
  jobDetails: { type: String, require: true },
  jobDescriptionPath: { type: String },
  numberOfCandidate: {type: Number, required: true},
  percentageMatch: {type: Number, required: true},
  addBy: { type: String, required: true },
  postDate: { type: Date, default: Date.now },
  expireDate: { type: Date, default: null },
  expireStatus: { type: Boolean, default: false},
  seventhDayAfterExpireDate: { type: Date, default: null },
  firstPaymentStatus: {type: Boolean, default: false}, // true: paid, false: not paid
  hiredStatus: { type: Boolean, default: null}, 
  hiringPaymentStatus: {type: Boolean, default: null}, // true: paid, false: not paid
  transactionDetails: {
    transactionIdForAddJob: { // using for first payment
      transactionId: { type: String }
    },
    transactionIdAfterHired: { // using for second payment
      transactionId: { type: String }
    }
  },
  matchesCandidateFlag: {type: Boolean, default: false},
  matchesCandidateCount: {type: Number, default: 0},

  title: { type: String, required: true },
  location: { type: String, required: true },
  zipcode: { type: String },
  availability: { type: String, enum : ['Remote','On-site', 'Flexible', ''] }, //new field
  cause: { type: String },
  jobType: { type: String }, // full-time/part-time

  soonestJoinDate: { type: Date }, 
  fluentInEnglish: { type: Boolean },
  eligibleToWorkInUS: { type: Boolean },

  requiredEducationLevel: { type: Number },
  timeZone: { type: String },
  hourlyWage: { type: Number}, //for part-timer
  salary: { type: Number, required: true }, // for full-timer
  minExperience: {type: Number, required: true},
  keySkills: { type: Array, required: true },
  
  // requireCertification: { type: String },
  // otherLanguages: { type: Array },
  // workDays: { type: Array }, 
  // workHours: { type: String }, 
  // maxExperience: { type: Number, required: true },
});

// Model to export
const Jobs = mongoose.model('Jobs', jobSchema);


module.exports = Jobs;