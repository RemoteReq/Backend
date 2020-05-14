const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const authorisation = require('../../server/authentication')
const saltRounds = 10;
const addUser = async(req, res) => {
  try {
    let salt = await bcrypt.genSalt(saltRounds);
    let hashPassword = await bcrypt.hash(req.body.credentials.password, salt);
    
    const user = new User({
      credentials: {
        username: req.body.credentials.username,
        password: hashPassword,
        firstName: req.body.credentials.firstname,
        lastName: req.body.credentials.lastname,
        email: req.body.credentials.email,
        authSignature: ''
      },
      profile:{
        fluentInEnglish: req.body.profile.fluentInEnglish,
        eligibleToWorkInUS: req.body.profile.eligibleToWorkInUS,
        linkedInURL: req.body.profile.linkedInURL,
        githubURL: req.body.profile.githubURL,
        personalURL: req.body.profile.personalURL
      }
    });

    //save user's details
    user.save()
    .then(doc => {
      console.log(doc);
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
    let getUserData = await User.findOne({ 'credentials.username': req.body.username });
    if(getUserData != null){
      let passwordverify = await bcrypt.compare(req.body.password, getUserData.credentials.password);
      if(passwordverify == true){
        let userDataWithToken = await authorisation.generateToken(getUserData);
        res.status(200).json({
          token: userDataWithToken.token,
          username: userDataWithToken.updateData.credentials.username,
          firstName: userDataWithToken.updateData.credentials.firstName,
          lastName: userDataWithToken.updateData.credentials.lastName,
          email: userDataWithToken.updateData.credentials.email
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

const updateSignature = (credentialId)=>{
  
}

const listUsers = async(req, res)=>{
  try {
    let getUserData = await User.find();
    res.status(200).json(getUserData);
    
  } catch(err) {
    res.status(500).json(err);
  }
}
module.exports = {
  addUser,
  verifyCredentials,
  listUsers
};