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
    process.env.HOST_TYPE == 'live'? mailToEmployerForCandidateMatch(req,res) : mailToEmployerForCandidateMatchTest(req,res)
})

router.post('/mailForTwoDaysLeft', (req, res)=>{
    process.env.HOST_TYPE == 'live'? mailForTwoDaysLeft(req,res) : mailForTwoDaysLeftTest(req,res)
})

router.post('/checkHiredOrNot', (req, res)=>{
    process.env.HOST_TYPE == 'live'? checkHiredOrNot(req,res) : checkHiredOrNotTest(req,res)
})

router.post('/checkExpiredJob', (req, res)=>{
    process.env.HOST_TYPE == 'live'? checkExpiredJob(req,res) : checkExpiredJobTest(req,res)
})

router.post('/isHired', (req, res)=>{
    process.env.HOST_TYPE == 'live'? isHired(req,res) : isHiredTest(req,res)
})

router.post('/employerNotRespForHiring', (req, res)=>{
    process.env.HOST_TYPE == 'live'? autoUpdateHiringStatus(req,res) : autoUpdateHiringStatusTest(req,res)
})



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

