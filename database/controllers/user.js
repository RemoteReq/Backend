const User = require('../models/User.js');
const bcrypt = require('bcrypt');
/*
  CRUD handlers

  Create -> .save()
  Read   -> .find() -> should list all
         -> .findOne() -> should find just one user
  Update -> .findOneAndUpdate()
  Delete -> .deleteOne()
*/

function addUser(payload, callback) {  
  
  // Add a new user to the database
  const user = new User(payload);

  user.save((err, data) => {
    if (err) {
      console.log('could not add user.');
      callback(err);
    } else {
      console.log('adding user..');
      callback(null, data);
      console.log('success!');
    }
  });
}
  
// Retrieve and list all users from database (we may actually not want to use this, but it's there)
function listUsers(callback) {
  User.find({}, (err, data) => {
    if (err) {
      console.log('could not list users.');
      callback(err);
    } else {
      console.log('retrieving list of users..');
      callback(null, data);
      console.log('success!');
    }
  });
}

// Change a User's password
function updateUserPassword(payload, callback) {
  const query = {
    username: payload.username,
  };

  User.updateOne(query, {
    password: payload.password,
  }, (err, data) => {
    if (err) {
      console.log('could not find user to update.');
      callback(err);
    } else {
      console.log('updating user password..');
      callback(null, data);
      console.log('success!');
    }
  });
}

// Remove account
function deleteUser(payload, callback) {
  const query = {
    username: payload.username,
  };

  User.deleteOne(query, (err, data) => {
    if (err) {
      console.log('could not find user to delete.');
      callback(err);
    } else {
      console.log('deleting user..');
      callback(null, data);
      console.log('success!');
    }
  });
}

// Find User
function findUser(payload, callback) {
  const query = {
    credentials: {
      username: payload.username,
    },
  };

  console.log(query);

  User.findOne(query,(err, data) => {
    if (err) {
      console.log('could not find user', err);
      callback(err);
    } else {
      console.log('user found! Logging in..', data);
      callback(null, data);
    }
  });
}

function authenticate(payload, callback) {
  console.log('authenticating:',payload);

  User.findOne({ 'credentials.username': payload.username }, 'credentials.password', (err, document) => {
    if (err) {
      console.log('could not find user to authenticate');
      callback(err);
    } else {
      console.log('here is the password for the user', payload.username, document);

      bcrypt.compare(payload.password, document.credentials.password, (err, res) => {
        console.log("comparing: ", payload.password, " to ", document.credentials.password, " = ", res)
        if (res === false) {
          console.log('error comparing passwords');
          callback(null, res);
        } 
        if (res === true) {
          console.log('successful comparison, lets get you logged in :)', res);
          callback(null);
        }
      })
    }
  });
}

module.exports = {
  authenticate,
  addUser,
  listUsers,
  findUser,
  updateUserPassword,
  deleteUser,
};