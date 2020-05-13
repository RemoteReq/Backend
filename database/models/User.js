// import DB connection
const mongoose = require('../mongoose.config.js');

const { Schema } = mongoose;

// Sub documents

const credentialsSchema = new Schema({
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, require: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
});

const profileSchema = new Schema({
  fluentInEnglish: { type: Boolean },
  eligibleToWorkInUS: { type: Boolean },
  linkedInURL: { type: String },
  githubURL: { type: String },
  personalURL: { type: String },
});

// User Schema
const userSchema = new Schema({
  credentials: { type: credentialsSchema, required: true },
  profile: { type: profileSchema },
});

// Email Unique Validator
// userSchema.pre('save', (next) => {
//   User.find({
//     email: this.email
//   }, (err, docs) => {
//     if (!docs.length) {
//       next();
//     } else {
//       console.log('caught pre-save, email already exists!', this.email);
//       next(new Error("Email is already registered!"));
//     }
//   })
// });

// Username Unique validator
// userSchema.pre('save', (next) => {
//   User.find({
//     username: this.username,
//   }, (err, docs) => {
//     if (!docs.length) {
//       next();
//     } else {
//       console.log('caught pre-save, username already exists!', this.username);
//       next(new Error("Username is already taken!"));
//     }
//   })
// });



// Model to export
const User = mongoose.model('Users', userSchema);

module.exports = User;