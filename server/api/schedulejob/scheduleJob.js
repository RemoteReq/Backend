const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator');

const {
    // mailToEmployerForCandidateMatch, 
    mailForTwoDaysLeft,
    checkHiredOrNot,
    checkExpiredJob,
    isHired,
    autoUpdateHiringStatus
} = require('../../../database/controllers/scheduleJob')

// router.post('/mailToEmployerForCandidateMatch', (req, res)=>{
//     mailToEmployerForCandidateMatch(req,res)
// })

router.post('/mailForTwoDaysLeft', mailForTwoDaysLeft)

router.post('/checkHiredOrNot', checkHiredOrNot)

router.post('/checkExpiredJob', checkExpiredJob)

router.post('/isHired', isHired)

router.post('/employerNotRespForHiring', autoUpdateHiringStatus)

module.exports = router

