const express = require('express');
const route = express.Router();
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const secretKeyForResetToken = 'remoteReq reset key for users'

// import handler
const { verifyCredentials, generateResetToken, resetPassword } = require('../../../database/controllers/user.js');
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

route.post('/forgotPassword',[
  check('email','Email id is required').not().isEmpty(),
], (req, res)=>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array() 
    })
  }

  // verifyCredOnForgotPass(req, res)
  generateResetToken(req, res)
})

route.post('/resetPassword',[
  check('resetToken','resetToken is required').not().isEmpty(),
  check('newPassword','New Password is required').not().isEmpty(),
], async(req, res)=>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array() 
    })
  }
  
  jwt.verify(req.query.resetToken, secretKeyForResetToken, async function(err, decoded) {
      if(err){
          res.status(400).json(err)
      }else{
        // console.log('decoded', decoded)
        req.body.userId = decoded.userId
        resetPassword(req, res)
      }  
  });
  
})

module.exports = route;