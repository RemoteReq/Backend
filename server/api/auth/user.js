const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// import controller methods here from database
const {
  addUser,
  listUsers,
  desireJob,
  filterJobs,
  updateUserProfile
} = require('../../../database/controllers/user.js');

// route handlers


router.post('/list', listUsers);

router.post('/desireJob',[
  check('desireIndustryType','Desire industry is required').not().isEmpty(),
  check('desireJobRole','Desire role is required').not().isEmpty(),
  check('desireCTC','Desire CTC is required').not().isEmpty(),
  check('desireLocation','Desire Location is required').not().isEmpty(),
  check('desireKeySkills','Desire key skills is required').not().isEmpty(),
], (req,res)=>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array() 
    })
  }
  desireJob(req,res)
});

router.post('/updateUserProfile',[
  check('fluentInEnglish','fluentInEnglish is required').not().isEmpty(),
  check('eligibleToWorkInUS','eligibleToWorkInUS is required').not().isEmpty(),
  check('linkedInURL','linkedInURL is required').not().isEmpty(),
  check('githubURL','githubURL is required').not().isEmpty(),
  check('personalURL','personalURL is required').not().isEmpty(),
  check('mobileNum','Mobile Number is required').not().isEmpty(),
  check('gender','Gender is required').not().isEmpty(),
  check('dob','Date of birth is required').not().isEmpty(),
  check('industryType','Industry Type is required').not().isEmpty(),
  check('jobRole','Job Role is required').not().isEmpty(),
  check('currentCTC','Current CTC is required').not().isEmpty(),
  check('totalExperience','Total Experience is required').not().isEmpty(),
  check('keySkills','Key Skills is required').not().isEmpty(),
], (req,res)=>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array() 
    })
  }
  updateUserProfile(req,res)
});

router.post('/filterJobs', filterJobs)



module.exports = router;