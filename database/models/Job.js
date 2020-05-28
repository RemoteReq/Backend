// import DB connection
const mongoose = require('../mongoose.config.js');

const { Schema } = mongoose;

// User Schema
const jobSchema = new Schema({
  companyName: { type: String, required: true },
  industryType: { type: String, required: true },
  role: { type: String, required: true },
  jobDetails: { type: String, require: true },
  keySkills: { type: Array, required: true },
  ctc: { type: Number, required: true },
  minExperience: {type: Number, required: true},
  maxExperience: { type: Number, required: true },
  location: { type: String, required: true }
});

// Model to export
const Jobs = mongoose.model('Jobs', jobSchema);


module.exports = Jobs;