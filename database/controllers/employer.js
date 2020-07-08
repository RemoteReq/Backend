const Employer = require('../models/Employer');
const Job = require('../models/Job');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const authorisation = require('../../server/authentication')
const saltRounds = 10;
const addEmployer = async(req, res) => {
  try {
    let salt = await bcrypt.genSalt(saltRounds);
    let hashPassword = await bcrypt.hash(req.body.password, salt);

    let checkUserName = await Employer.findOne({"username" : req.body.username});
    if(checkUserName == null){
      let checkEmail = await Employer.findOne({"email" : req.body.email});
      if(checkEmail == null){
        const employer = new Employer({
          username: req.body.username,
          password: hashPassword,
          email: req.body.email,
          authSignature: '',
          companyName: '',
          logo: '',
          location: ''
        });
    
        //save Employer's details
        employer.save()
        .then(doc => {
          // console.log(doc);
          // let filterDoc = {
          //   username: doc.username,
          //   email: doc.email,
          //   companyName: doc.companyName,
          //   logo: doc.logo,
          //   location: doc.location
          // }
          // res.status(200).json(filterDoc);
          res.status(200).json('Signed up successfully done');
        })
        .catch(error => {
          console.log('ERROR 💥:', error)
          res.status(500).json(error);
        });

      }else{
        res.status(400).json('Email Id already exists.');
      }
    }else{
      res.status(400).json('User Name already exists.');
    }

  } catch(err) {
    console.log('catcherr',err);
    res.status(500).json(err);
  }
  
};
  
const employerCredVerify = async(req, res)=>{
  try {
    // let getEmpData = await Employer.findOne({ 'username': req.body.username });
    let getEmpData = await Employer.findOne({ $or: [
      {'username': req.body.emailOrUserName}, {'email': req.body.emailOrUserName}
    ] });
    if(getEmpData != null){
      let passwordverify = await bcrypt.compare(req.body.password, getEmpData.password);
      if(passwordverify == true){
        let empDataWithToken = await authorisation.generateTokenForEmp(getEmpData);
        res.status(200).json({
          token: empDataWithToken.token,
          username: empDataWithToken.updateData.username,
          email: empDataWithToken.updateData.email
        });
      }else{
        res.status(400).json('Password is not matched. please try again.');
      }
      
    }else{
      res.status(400).json('Email or UserName is not found. please check.');
    }
    
  } catch(err) {
    res.status(500).json(err);
  }
}



// const updateUserProfile = async(req, res)=>{
//   try{
    
//     let updateData = await User.findByIdAndUpdate(req.userId, { $set: req.body});
//     let getUserData = await User.findById(req.userId);
    
//     res.status(200).json(getUserData);
//   } catch(err) {
//       console.log(err);
//   }
// }

const listEmployers = async(req, res)=>{
  try {
    let getData = await Employer.find().select("-password -authSignature -_id -__v");
    res.status(200).json(getData);
    
  } catch(err) {
    res.status(500).json(err);
  }
}


const getSingleEmployerDetails = async(req, res)=>{
  try{
    
    let getData = await Employer.findById(req.employerId).select("-_id -__v -password -authSignature");
    
    res.status(200).json(getData);
  } catch(err) {
      console.log(err);
  }
}

const getJoblistByEmployer = async(req, res)=>{
  try{
    
    // let getData = await Job.find(req.employerId).select("-_id -__v -password -authSignature");
    let getData = await Job.find({addBy: req.employerId}).select("-__v -addBy");
    
    res.status(200).json(getData);
  } catch(err) {
      console.log(err);
  }
}

const matchesCandidateByEachJob = async(req, res)=>{
  try{
    
    let getJobData = await Job.findById(req.params.jobId).select("-__v -addBy");

    let getCandidateList = await User.find({ 
      $and: [ 
        { industryType: getJobData.industryType }, 
        { desireCTC : { $lte: getJobData.ctc } },
        { $and: [ { totalExperience: { $gte: getJobData.minExperience } }, { totalExperience : { $lte: getJobData.maxExperience } } ] },
        {desireLocation : { $in: getJobData.location}},
        {desireKeySkills : { $in: getJobData.keySkills}},
      ] 
    })
    
    res.status(200).json(getCandidateList);
  } catch(err) {
      console.log(err);
  }
}

module.exports = {
  addEmployer,
  employerCredVerify,
  listEmployers,
  // updateUserProfile,
  getSingleEmployerDetails,
  getJoblistByEmployer,
  matchesCandidateByEachJob
};