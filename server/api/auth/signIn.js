const express = require('express');
const route = express.Router();
const { check, validationResult } = require('express-validator');

// import handler
const { verifyCredentials } = require('../../../database/controllers/user.js');

route.post('/',[
check('username','Username is required').not().isEmpty(),
check('password','Password is required').not().isEmpty()
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      status:422,
      errors: errors.array() 
    })
  }

  verifyCredentials(req, res)
});
module.exports = route;