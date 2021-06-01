// import DB connection
const mongoose = require('../mongoose.config.js');

const { Schema } = mongoose;

// DemoRequest Schema
const cause = new Schema({
  value: {type: String, required: true},
  label: {type: String, required: true},
});

// Model to export
const Cause = mongoose.model('Cause', cause);


module.exports = Cause;