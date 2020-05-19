const mongoose = require('../mongoose.config.js');

const { Schema } = mongoose;

const JobSchema = new Schema({
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  jobDescription: { type: String, required: true },
  yearsOfExperience: { type: Number, required: true },
  skills: { type: Array },
});

const Jobs = mongoose.model('Job', JobSchema, 'mock-jobs');

module.exports = Jobs;