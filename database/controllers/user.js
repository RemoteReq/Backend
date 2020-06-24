const User = require('../models/User.js');
const Jobs = require('../models/Job');
const bcrypt = require('bcrypt');
const authorisation = require('../../server/authentication')
const saltRounds = 10;
const addUser = async(req, res) => {
  try {
    let salt = await bcrypt.genSalt(saltRounds);
    let hashPassword = await bcrypt.hash(req.body.password, salt);

    let checkUserName = await User.findOne({"username" : req.body.username});
    if(checkUserName == null){
      let checkEmail = await User.findOne({"email" : req.body.email});
      if(checkEmail == null){
        const user = new User({
          username: req.body.username,
          password: hashPassword,
          firstName: req.body.firstname,
          lastName: req.body.lastname,
          email: req.body.email,
          authSignature: '',
          fluentInEnglish: null,
          eligibleToWorkInUS: null,
          linkedInURL: '',
          githubURL: '',
          personalURL: '',
          profilePicUrl: '',
          mobileNum: '',
          gender: '',
          dob: null,
          industryType: '',
          jobRole: '',
          currentCTC: null,
          totalExperience: null,
          keySkills: [],
          education: [],
          desireIndustryType: '',
          desireJobRole: '',
          desireCTC: null,
          desireLocation: [],
          desireKeySkills: [],
        });
    
        //save user's details
        user.save()
        .then(doc => {
          // doc = doc.toObject();
          // delete doc._id;
          // delete doc["password"];
          // delete doc["__v"];
          // res.status(200).json(doc);
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
  
const verifyCredentials = async(req, res)=>{
  try {
    let getUserData = await User.findOne({ 'username': req.body.username });
    if(getUserData != null){
      let passwordverify = await bcrypt.compare(req.body.password, getUserData.password);
      if(passwordverify == true){
        let userDataWithToken = await authorisation.generateToken(getUserData);
        res.status(200).json({
          token: userDataWithToken.token,
          username: userDataWithToken.updateData.username,
          firstName: userDataWithToken.updateData.firstName,
          lastName: userDataWithToken.updateData.lastName,
          email: userDataWithToken.updateData.email
        });
      }else{
        res.status(400).json('Password is not matched. please try again.');
      }
      
    }else{
      res.status(400).json('username is not found. please check.');
    }
    
  } catch(err) {
    res.status(500).json(err);
  }
}


const desireJob = async(req, res)=>{
  try{
    let updateData = await User.findByIdAndUpdate(req.userId, { $set: req.body});
    let getUserData = await User.findById(req.userId).select("-_id -__v -password -authSignature");
    
    res.status(200).json(getUserData);
  } catch(err) {
      console.log(err);
  }
}

const updateUserProfile = async(req, res)=>{
  try{
    
    let updateData = await User.findByIdAndUpdate(req.userId, { $set: req.body});
    let getUserData = await User.findById(req.userId).select("-_id -__v -password -authSignature");
    
    res.status(200).json(getUserData);
  } catch(err) {
      console.log(err);
  }
}

const listUsers = async(req, res)=>{
  try {
    let getUserData = await User.find().select("-_id -__v -password -authSignature");
    res.status(200).json(getUserData);
    
  } catch(err) {
    res.status(500).json(err);
  }
}

const filterJobs = async(req, res)=>{
  try{
    let getUserData = await User.findById(req.userId);
    let getJobsByIndustryType = await Jobs.find({ 
      $and: [ 
        { industryType: getUserData.desireIndustryType }, 
        { ctc : { $gte: getUserData.desireCTC } },
        { $and: [ { minExperience: { $lte: getUserData.totalExperience } }, { maxExperience : { $gte: getUserData.totalExperience } } ] },
        {location : { $in: getUserData.desireLocation}},
        {keySkills : { $in: getUserData.desireKeySkills}},
      ] 
    })
    res.status(200).json(getJobsByIndustryType);
  } catch(err) {
      console.log(err);
  }
}

const getSingleUserDetails = async(req, res)=>{
  try{
    
    let getUserData = await User.findById(req.userId).select("-_id -__v -password -authSignature");
    
    res.status(200).json(getUserData);
  } catch(err) {
      console.log(err);
  }
}

module.exports = {
  addUser,
  verifyCredentials,
  listUsers,
  desireJob,
  filterJobs,
  updateUserProfile,
  getSingleUserDetails
};