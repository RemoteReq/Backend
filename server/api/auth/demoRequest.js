const express = require('express');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

const router = express.Router();

/*
  Pseudocode:
  Input: User credentials and 
*/

// import handler
const { addDemoRequest } = require('../../../database/controllers/demoRequest');

router.post('/',[
  check('emailId').isEmail().withMessage('Invalid Email Id'),
  check('name','Name is required').not().isEmpty(),
], (req,res)=>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array() 
    })
  }
  
  addDemoRequest(req,res)
});

module.exports = router;