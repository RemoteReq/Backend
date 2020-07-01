const express = require('express');
const route = express.Router();
const { check, validationResult } = require('express-validator');

// import handler
const { verifyCredentials } = require('../../../database/controllers/user.js');
const { employerCredVerify } = require('../../../database/controllers/employer');

route.post('/',[
check('emailOrUserName','Email Or UserName is required').not().isEmpty(),
check('password','Password is required').not().isEmpty()
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array() 
    })
  }

  verifyCredentials(req, res)
});

route.post('/employerSignIn',[
  check('emailOrUserName','Email Or UserName is required').not().isEmpty(),
  check('password','Password is required').not().isEmpty()
  ], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ 
        errors: errors.array() 
      })
    }
  
    employerCredVerify(req, res)
  });
module.exports = route;