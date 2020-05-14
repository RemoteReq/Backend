const express = require('express');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

const router = express.Router();

/*
  Pseudocode:
  Input: User credentials and 
*/

// import handler
const { addUser } = require('../../../database/controllers/user.js');

router.post('/',[
  // check('name').isLength({ min: 5 }).withMessage('Must be at least 5 chars long'),
  check('credentials.email').isEmail().withMessage('Invalid Email Id'),
  check('credentials.username','Username is required').not().isEmpty(),
  check('credentials.firstname','First Name is required').not().isEmpty(),
  check('credentials.lastname','Last Name is required').not().isEmpty(),
  check('credentials.password','Password is required').not().isEmpty()
], (req,res)=>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array() 
    })
  }
  addUser(req,res)
});

module.exports = router;