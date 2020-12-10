const express = require('express');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

const router = express.Router();

/*
  Pseudocode:
  Input: User credentials and 
*/

// import handler
const { addSubscriber, subscribersList, unsubscribe } = require('../../../database/controllers/subscribers');

router.post('/',[
  // check('name').isLength({ min: 5 }).withMessage('Must be at least 5 chars long'),
  check('emailId').isEmail().withMessage('Invalid Email Id'),
  check('name','Name is required').not().isEmpty(),
], (req,res)=>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array() 
    })
  }
  
  addSubscriber(req,res)
});

router.post('/getList', subscribersList);

router.post('/unsubscribe',[
  // check('name').isLength({ min: 5 }).withMessage('Must be at least 5 chars long'),
  check('emailId').isEmail().withMessage('Invalid Email Id'),
], (req,res)=>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array() 
    })
  }
  // console.log(req.query.emailId)
  unsubscribe(req, res)
})

module.exports = router;