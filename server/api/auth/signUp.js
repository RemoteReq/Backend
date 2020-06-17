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
const {addEmployer } = require('../../../database/controllers/employer')

router.post('/',[
  // check('name').isLength({ min: 5 }).withMessage('Must be at least 5 chars long'),
  check('email').isEmail().withMessage('Invalid Email Id'),
  check('username','Username is required').not().isEmpty(),
  check('firstname','First Name is required').not().isEmpty(),
  check('lastname','Last Name is required').not().isEmpty(),
  check('password','Password is required').not().isEmpty()
], (req,res)=>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array() 
    })
  }
  
  addUser(req,res)
});

router.post('/employerSignUp',[
  check('username','UserName is required').not().isEmpty(),
  check('password','Password is required').not().isEmpty(),
  check('email','Email is required').not().isEmpty()
], (req,res)=>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array() 
    })
  }
  // res.send('hello emp')
  addEmployer(req,res)
})

module.exports = router;