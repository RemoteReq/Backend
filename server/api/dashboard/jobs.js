const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
// const gateway = require('../../../gateway/connection')
// console.log('gateway', gateway)
const AWS = require('aws-sdk');
const fs=require('fs');
const util = require('util');
// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);
var multer  = require('multer')

//multer storage
const storage = multer.diskStorage({
    destination : 'uploads/',
    // destination : function(req, file, cb){
    //   if (file.fieldname === 'companyLogo') {
    //     console.log('addf')
    //     cb(null, 'uploads/job/logo/')
    //   } else if (file.fieldname === 'jobDescription') {
    //     cb(null, 'uploads/job/jobdesc/')
    //   }
    // },
    filename: function (req, file, cb) {
      file.originalname = Date.now()+file.originalname;
      cb(null, file.originalname);
    }
    
});
const upload = multer({ storage: storage });
// var upload = multer({ dest: 'uploads/' })
  
//setting the credentials
AWS.config.update({
    accessKeyId: process.env.IAM_ACCESS_ID,
    secretAccessKey: process.env.IAM_SECRET,
    region: 'us-east-2',
});
  
//Creating a new instance of S3:
const s3= new AWS.S3();
// Unique name of aws s3 bucket created
const myBucket = 'remotereq';

// Removed until DB queries are establshed
const { addJob, jobsList,
  // createClientForGateway,
  clientTokenForPayment,
  checkoutForAddjob,
  checkoutAfterHired
 } = require('../../../database/controllers/jobs.js');

router.post('/getAll', jobsList);

router.post('/add', upload.fields([{
  name: 'companyLogo', maxCount: 1
}, {
  name: 'jobDescription', maxCount: 1
}]), [
  check('title','Job title is required').not().isEmpty(),
  check('companyName','Company Name is required').not().isEmpty(),
  check('industryType','Industry Type is required').not().isEmpty(),
  // check('role','Role is required').not().isEmpty(),
  check('jobDetails','Job Details is required').not().isEmpty(),
  check('keySkills','Key Skills is required').not().isEmpty(),
  check('ctc','CTC is required').not().isEmpty(),
  check('minExperience','Minimum Experience is required').not().isEmpty(),
  check('maxExperience','Maximum Experience is required').not().isEmpty(),
  check('location','Location is required').not().isEmpty(),
  check('numberOfCandidate','Number of Candidates is required').not().isEmpty(),
  check('percentageMatch','Percentage match value is required').not().isEmpty(),
  check('transactionIdForAddJob','Transaction Id is required').not().isEmpty(),
], async(req,res)=>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array() 
    })
  }

  if(req.files.companyLogo){
    // console.log('companyLogoFiles', req.files['companyLogo'][0])
    let logoPath = await uploadCompanyLogo(req,res)
    req.body.companyLogoPath = logoPath;
  }
  if(req.files.jobDescription){
    // console.log('jobDescriptionFiles', req.files['jobDescription'][0])
    let descPath = await uploadJobDescFile(req, res)
    req.body.jobDescriptionPath = descPath
  }
  
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

// router.post('/uploadCompanyLogoOfJobPost', upload.single('companyLogo'),(req, res)=>{
    
//   uploadFile(req, res);
// })

async function uploadCompanyLogo(req, res){
  console.log('preparing to job_comp_logo upload...');
  let source = req.files['companyLogo'][0].path;
  let targetName = req.files['companyLogo'][0].filename;
  
  let getResult1 = await readFile(source).then(async (filedata)=>{
    // console.log(filedata)
    const putParams = {
      Bucket      : myBucket,
      Key         : `post_job/company_logo/${targetName}`,
      Body        : filedata,
      ACL         :'public-read-write'
    };

    let getResult2 = await new Promise((resolve, reject) => {
      s3.upload(putParams, function (err, data) {
        //handle error
        if (err) {
          console.log("Error", err);
        }
      
        //success
        if (data) {
          fs.unlinkSync(source);
          // console.log('path1', data.Location)
          resolve(data.Location)
        }
      });
    })
    // console.log('getResult2', getResult2);
    return getResult2
  }, 
  error=>{
    console.log({'company logo readFileErr ':error});
  })
  // console.log('getResult1', getResult1);
  return getResult1
}

async function uploadJobDescFile(req, res){
  console.log('preparing to job_desc_file upload...');
  let source = req.files['jobDescription'][0].path;
  let targetName = req.files['jobDescription'][0].filename;
  
  let getResult1 = await readFile(source).then(async (filedata)=>{
    // console.log(filedata)
    const putParams = {
      Bucket      : myBucket,
      Key         : `post_job/job_description_file/${targetName}`,
      Body        : filedata,
      ACL         :'public-read-write'
    };

    let getResult2 = await new Promise((resolve, reject) => {
      s3.upload(putParams, function (err, data) {
        //handle error
        if (err) {
          console.log("Error", err);
        }
      
        //success
        if (data) {
          fs.unlinkSync(source);
          // console.log('path1', data.Location)
          resolve(data.Location)
        }
      });
    })
    // console.log('getResult2', getResult2);
    return getResult2
  }, 
  error=>{
    console.log({'job desc readFileErr ':error});
  })
  // console.log('getResult1', getResult1);
  return getResult1
}

module.exports = router;