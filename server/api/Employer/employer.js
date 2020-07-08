const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const {listEmployers, getSingleEmployerDetails, getJoblistByEmployer, matchesCandidateByEachJob} = require('../../../database/controllers/employer')

router.post('/list', listEmployers)

router.post('/getSingleEmployer', getSingleEmployerDetails)

router.post('/joblistByEmployer', getJoblistByEmployer)
router.post('/matchesCandidateByEachJob/:jobId', [
    check('jobId','Job Id is required').not().isEmpty()
 ], (req,res)=>{
  
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ 
        errors: errors.array() 
        })
    }
    matchesCandidateByEachJob(req,res)
})

module.exports = router