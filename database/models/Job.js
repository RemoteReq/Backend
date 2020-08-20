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
  // role: { type: String, required: true },
  jobDetails: { type: String, require: true },
  jobDescriptionPath: { type: String },
  keySkills: { type: Array, required: true },
  ctc: { type: Number, required: true },
  minExperience: {type: Number, required: true},
  maxExperience: { type: Number, required: true },
  location: { type: String, required: true },
  numberOfCandidate: {type: Number, required: true},
  percentageMatch: {type: Number, required: true},
  addBy: { type: String, required: true },
  postDate: { type: Date, default: Date.now },
  expireDate: { type: Date, default: new Date(+new Date() + 21*24*60*60*1000) },
  // expireDate: { type: Date, default: new Date(+new Date() + 3*24*60*60*1000) },
  expireStatus: { type: Boolean, default: false},
  seventhDayAfterExpireDate: { type: Date, default: new Date(+new Date() + 28*24*60*60*1000) },
  // seventhDayAfterExpireDate: { type: Date, default: new Date(+new Date() + 5*24*60*60*1000) },
  // mailForCandidateMatch: { type: Boolean, default: false},
  hiredStatus: { type: Boolean, default: null}, 
  hiringPaymentStatus: {type: Boolean, default: null}, // true: paid, false: not paid
  transactionDetails: {
    transactionIdForAddJob: {
      transactionId: { type: String, required: true }
    },
    transactionIdAfterHired: {
      transactionId: { type: String }
    }
  }
  
});

// Model to export
const Jobs = mongoose.model('Jobs', jobSchema);


module.exports = Jobs;