require('dotenv').config();
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const AWS = require('aws-sdk');
const fs=require('fs');
var multer  = require('multer')
// multerS3 = require('multer-s3');
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
const myBucket = 'remotereq';

// import controller methods here from database
const {
  addUser,
  listUsers,
  desireJob,
  filterJobs,
  updateUserProfile,
  getSingleUserDetails,
  deleteAccount
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
  // check('fluentInEnglish','fluentInEnglish is required').not().isEmpty(),
  // check('eligibleToWorkInUS','eligibleToWorkInUS is required').not().isEmpty(),
  // check('linkedInURL','linkedInURL is required').not().isEmpty(),
  // check('githubURL','githubURL is required').not().isEmpty(),
  // check('personalURL','personalURL is required').not().isEmpty(),
  // check('mobileNum','Mobile Number is required').not().isEmpty(),
  // check('gender','Gender is required').not().isEmpty(),
  // check('dob','Date of birth is required').not().isEmpty(),
  // check('industryType','Industry Type is required').not().isEmpty(),
  // check('jobRole','Job Role is required').not().isEmpty(),
  // check('currentCTC','Current CTC is required').not().isEmpty(),
  // check('totalExperience','Total Experience is required').not().isEmpty(),
  // check('keySkills','Key Skills is required').not().isEmpty(),
], (req,res)=>{
  
  // const errors = validationResult(req)
  // if (!errors.isEmpty()) {
  //   return res.status(422).json({ 
  //     errors: errors.array() 
  //   })
  // }
  updateUserProfile(req,res)
});

router.post('/filterJobs', filterJobs)

router.post('/updateProfileDataWithImage', upload.single('userImage'),(req, res)=>{
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array() 
    })
  }
  
  uploadFile(req, res);
})


//The uploadFile function
function uploadFile(req, res){
  console.log('preparing to upload...');
  let source = req.file.path;
  let targetName = req.file.filename;
  fs.readFile(source, function (err, filedata) {
    if (!err) {
      const putParams = {
          Bucket      : myBucket,
          Key         : `user_profile_image/${targetName}`,
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
          req.body.profilePicUrl = data.Location;
          updateUserProfile(req,res)
        }
      });
    }
    else{
      console.log({'readFileErr':err});
    }
  });
}


router.post('/getSingleUserDetails', getSingleUserDetails)

router.post('/deleteAccount', deleteAccount)

router.post('/uploadResume', upload.single('uploadResume'), (req,res)=>{
  uploadResume(req,res)
})

function uploadResume(req, res){
  console.log('preparing to upload resume...');
  let source = req.file.path;
  let targetName = req.file.filename;
  fs.readFile(source, function (err, filedata) {
    if (!err) {
      const putParams = {
          Bucket      : myBucket,
          Key         : `user_resume/${targetName}`,
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
          req.body.resumePath = data.Location;
          updateUserProfile(req,res)
        }
      });
    }
    else{
      console.log({'readFileErr':err});
    }
  });
}





module.exports = router;