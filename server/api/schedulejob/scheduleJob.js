const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator');

const {
    mailToEmployerForCandidateMatch, 
    mailForTwoDaysLeft,
    checkHiredOrNot,
    checkExpiredJob,
    isHired,
    autoUpdateHiringStatus
} = require('../../../database/controllers/scheduleJob')

const {
    mailToEmployerForCandidateMatchTest, 
    mailForTwoDaysLeftTest,
    checkHiredOrNotTest,
    checkExpiredJobTest,
    isHiredTest,
    autoUpdateHiringStatusTest
} = require('../../../database/controllers/scheduleJobForTesting')

router.post('/mailToEmployerForCandidateMatch', (req, res)=>{
    mailToEmployerForCandidateMatch(req,res)
})

router.post('/mailForTwoDaysLeft', mailForTwoDaysLeft)

router.post('/checkHiredOrNot', checkHiredOrNot)

router.post('/checkExpiredJob', checkExpiredJob)

router.post('/isHired', isHired)

router.post('/employerNotRespForHiring', autoUpdateHiringStatus)



//** For Testing Purpose **
// router.post('/checkExpiredJob', checkExpiredJobTest)

// router.post('/checkHiredOrNot', checkHiredOrNotTest)

// router.post('/isHired', isHiredTest)

// router.post('/employerNotRespForHiring', autoUpdateHiringStatusTest)

// router.post('/mailForTwoDaysLeft', mailForTwoDaysLeftTest)

// router.post('/mailToEmployerForCandidateMatch', (req, res)=>{
//     mailToEmployerForCandidateMatchTest(req,res)
// })

module.exports = router

