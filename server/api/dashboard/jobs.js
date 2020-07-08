const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Removed until DB queries are establshed
const { addJob, jobsList } = require('../../../database/controllers/jobs.js');

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
  check('location','Location is required').not().isEmpty()
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

module.exports = router;