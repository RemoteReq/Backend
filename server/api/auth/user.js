const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// import controller methods here from database
const {
  addUser,
  listUsers,
  desireJob,
  filterJobs
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

router.post('/filterJobs', filterJobs)



module.exports = router;