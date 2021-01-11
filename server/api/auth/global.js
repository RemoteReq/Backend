const express = require('express');

const router = express.Router();

// import handler
const { listEmployers } = require('../../../database/controllers/employer');
const { 
    listUsers, 
    // updateEmailIdToLowerCase 
} = require('../../../database/controllers/user');
const { jobsList } = require('../../../database/controllers/jobs');

router.post('/getAllEmployers', listEmployers)
router.post('/getAllUsers', listUsers)
router.post('/getAllJobs', jobsList)

// router.post('/updateEmailIdToLowerCase', (req, res)=>{
//     updateEmailIdToLowerCase(req, res)
// })
module.exports = router;