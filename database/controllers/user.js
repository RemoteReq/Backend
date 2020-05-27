const User = require('../models/User.js');
const Jobs = require('../models/Job');
const bcrypt = require('bcrypt');
const authorisation = require('../../server/authentication')
const saltRounds = 10;
const addUser = async(req, res) => {
  try {
    let salt = await bcrypt.genSalt(saltRounds);
    let hashPassword = await bcrypt.hash(req.body.password, salt);
    
    const user = new User({
      
        username: req.body.username,
        password: hashPassword,
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        authSignature: '',
        fluentInEnglish: req.body.fluentInEnglish,
        eligibleToWorkInUS: req.body.eligibleToWorkInUS,
        linkedInURL: req.body.linkedInURL,
        githubURL: req.body.githubURL,
        personalURL: req.body.personalURL
    });

    //save user's details
    user.save()
    .then(doc => {
      // console.log(doc);
      res.status(200).json(doc);
    })
    .catch(error => {
      console.log('ERROR 💥:', error)
      res.status(500).json(error);
    });
  } catch(err) {
    console.log(err);
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
    let getUserData = await User.findById(req.userId);
    
    res.status(200).json(getUserData);
  } catch(err) {
      console.log(err);
  }
}

const listUsers = async(req, res)=>{
  try {
    let getUserData = await User.find();
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
        { $or : [ { ctc : { $gt: getUserData.desireCTC } }, { ctc : getUserData.desireCTC } ] },
        { $and : [ 
          { $or : [ { minExperience : { $lt: getUserData.totalExperience } }, { minExperience : getUserData.totalExperience } ] }, 
          { $or : [ { maxExperience : { $gt: getUserData.totalExperience } }, { maxExperience : getUserData.totalExperience } ] }, 
        ] },
        {location : { $in: getUserData.desireLocation}}
      ] 
    })
    res.status(200).json(getJobsByIndustryType);
  } catch(err) {
      console.log(err);
  }
}

module.exports = {
  addUser,
  verifyCredentials,
  listUsers,
  desireJob,
  filterJobs
};