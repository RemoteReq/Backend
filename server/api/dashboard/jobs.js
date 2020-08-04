const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
// const gateway = require('../../../gateway/connection')
// console.log('gateway', gateway)

// Removed until DB queries are establshed
const { addJob, jobsList,
  // createClientForGateway,
  clientTokenForPayment,
  checkoutForAddjob,
  checkoutAfterHired
 } = require('../../../database/controllers/jobs.js');

router.post('/getAll', jobsList);

router.post('/add',[
  check('companyName','Company Name is required').not().isEmpty(),
  check('industryType','Industry Type is required').not().isEmpty(),
  check('role','Role is required').not().isEmpty(),
  check('jobDetails','Job Details is required').not().isEmpty(),
  check('keySkills','Key Skills is required').not().isEmpty(),
  check('ctc','CTC is required').not().isEmpty(),
  check('minExperience','Minimum Experience is required').not().isEmpty(),
  check('maxExperience','Maximum Experience is required').not().isEmpty(),
  check('location','Location is required').not().isEmpty(),
  check('numberOfCandidate','Number of Candidates is required').not().isEmpty(),
  check('percentageMatch','Percentage match value is required').not().isEmpty(),
  check('transactionIdForAddJob','Transaction Id is required').not().isEmpty(),
], (req,res)=>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array() 
    })
  }
  // console.log(req.employerId)
  addJob(req,res)
});

// router.post("/createClientForGateway", [
//   check('firstName','firstName is required').not().isEmpty(),
//   // check('lastName','lastName is required').not().isEmpty(),
//   check('company','company is required').not().isEmpty(),
//   check('email','email is required').not().isEmpty(),
//   // check('phone','phone is required').not().isEmpty(),
// ], (req,res)=>{
//   const errors = validationResult(req)
//   if (!errors.isEmpty()) {
//     return res.status(422).json({ 
//       errors: errors.array() 
//     })
//   }
//   // console.log(req.employerId)
//   createClientForGateway(req,res)
// });

router.post("/client_token_for_payment", [
  check('clientId','gateway clientId is required').not().isEmpty(),
], (req,res)=>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array() 
    })
  }
  // console.log(req.employerId)
  clientTokenForPayment(req,res)
});

router.post("/checkoutForAddjob", [
  check('amount','amount is required').not().isEmpty(),
  check('paymentMethodNonce','paymentMethodNonce is required').not().isEmpty(),
], (req,res)=>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array() 
    })
  }
  // console.log(req.employerId)
  checkoutForAddjob(req,res)
});

router.post("/checkoutAfterHired", [
  check('jobId','job id is required').not().isEmpty(),
  check('amount','amount is required').not().isEmpty(),
  check('paymentMethodNonce','paymentMethodNonce is required').not().isEmpty(),
], (req,res)=>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array() 
    })
  }
  // console.log(req.employerId)
  checkoutAfterHired(req,res)
});

module.exports = router;