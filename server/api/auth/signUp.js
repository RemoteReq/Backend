const express = require('express');
const bcrypt = require('bcrypt');

const route = express.Router();

/*
  Pseudocode:
  Input: User credentials and 
*/

// import handler
const { addUser } = require('../../../database/controllers/User.js');

route.post('/', (req, res) => {
  console.log('incoming request for: ', req.body);

  bcrypt.hash(req.body.credentials.password, 10, (err, hash) => {
    if (err) {
      console.log('error hashing password', err);
    } else {
      const payload = {
        credentials: {
          username: req.body.credentials.username,
          password: hash,
          firstName: req.body.credentials.firstname,
          lastName: req.body.credentials.lastname,
          email: req.body.credentials.email
        }
      };

      console.log('hashing the payload:', payload);

      addUser(payload, (error, data) => {
        if (error) {
          console.log('database returned with an error', error);
          res.status(400).send('Error: No Such User');
        } else {
          console.log('signup successful!');
          // Redirect them to Signin service from here
          res.status(200).send('User registration complete! Please sign in!');
        }
      });
    }
  });
});

module.exports = route;