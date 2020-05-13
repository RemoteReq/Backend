const express = require('express');

const route = express.Router();

/*
  Pseudocode:

  input: user credentials
  output: json web token

*/

// import handler
const { authenticate } = require('../../../database/controllers/User.js');

route.post('/', (req, res) => {
  console.log('incoming request for: ', req.body);

  authenticate(req.body.body, (error, data) => {
    if (error || data === false) {
      console.log('database returned with an error', error);
      res.status(400).send('Error: No Such User');
    } else {
      console.log('successful login attempt!!');
      // Issue a jwt token here
      res.status(200).redirect('http://localhost:82/dashboard');
    }
  });
});
module.exports = route;