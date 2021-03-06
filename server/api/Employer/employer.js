const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const AWS = require('aws-sdk');
const fs=require('fs');
var multer  = require('multer')

//multer storage
const storage = multer.diskStorage({
    destination : 'uploads/',
    filename: function (req, file, cb) {
      file.originalname = Date.now()+file.originalname;
      cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
  
//setting the credentials
AWS.config.update({
    accessKeyId: process.env.IAM_ACCESS_ID,
    secretAccessKey: process.env.IAM_SECRET,
    region: 'us-east-2',
});
  
//Creating a new instance of S3:
const s3= new AWS.S3();
// Unique name of aws s3 bucket created
const myBucket = process.env.AWS_BUCKET;


const {listEmployers, 
    getSingleEmployerDetails, 
    getJoblistByEmployer, 
    matchesCandidateByEachJob, 
    deleteAccount,
    updateEmployerProfile,
    updatePassword
} = require('../../../database/controllers/employer')

router.post('/list', listEmployers)

router.post('/deleteAccount', [
  check('password','Password is required').not().isEmpty()
], (req, res)=>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array() 
    })
  }
  deleteAccount(req, res)
})

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

router.post('/updateEmployerProfile', updateEmployerProfile)

router.post('/uploadCompanyLogo', upload.single('empCompanyLogo'),(req, res)=>{
    
    uploadFile(req, res);
})

function uploadFile(req, res){
    console.log('preparing to upload...');
    let source = req.file.path;
    let targetName = req.file.filename;
    fs.readFile(source, function (err, filedata) {
      if (!err) {
        const putParams = {
            Bucket      : myBucket,
            Key         : `employer_company_logo/${targetName}`,
            Body        : filedata,
            ACL         :'public-read-write'
        };
        
        s3.upload(putParams, function (err, data) {
          //handle error
          if (err) {
            console.log("Error", err);
            res.status(403).json(err);
          }
        
          //success
          if (data) {
            fs.unlinkSync(source);
            req.body.companyLogo = data.Location;
            // console.log(req.body)
            updateEmployerProfile(req,res)
            // res.status(200).json(req.body.companyLogo);
          }
        });
      }
      else{
        console.log({'readFileErr':err});
      }
    });
}

router.post('/updatePassword',[
  check('oldPassword','Old Password is required').not().isEmpty(),
  check('newPassword','New Password is required').not().isEmpty(),
], async(req, res)=>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array() 
    })
  }
  // console.log(req.employerId)
  updatePassword(req, res)
})

module.exports = router