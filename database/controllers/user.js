const User = require('../models/User.js');
const Jobs = require('../models/Job');
const OtpMaster = require('../models/OTP_master');

var nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const authorisation = require('../../server/authentication')
const saltRounds = 10;
const addUser = async(req, res) => {
  try {
    let salt = await bcrypt.genSalt(saltRounds);
    let hashPassword = await bcrypt.hash(req.body.password, salt);

    let verifyEmail = await OtpMaster.findOne({"emailId" : req.body.email, "OTP": req.body.otp});
    // console.log(verifyEmail)
    if(verifyEmail != null){
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
      res.status(400).json('OTP not matched. Please try again.');
    }

  } catch(err) {
    console.log('catcherr',err);
    res.status(500).json(err);
  }
  
};

const sendOTP = async(req, res)=>{
  try{
    let checkUserName = await User.findOne({"username" : req.body.username});
    if(checkUserName == null){
      let checkEmail = await User.findOne({"email" : req.body.email});
      if(checkEmail == null){
        let randDigit = Math.floor(100000 + Math.random() * 900000);
        let findEmailInOTPmaster = await OtpMaster.findOne({"emailId" : req.body.email});
        // console.log(findEmailInOTPmaster)
        if(findEmailInOTPmaster == null){
          const otpMaster = new OtpMaster({
            OTP: randDigit,
            emailId: req.body.email
          })
    
          otpMaster.save().then(data =>{
            sendMail(req, res, randDigit)
          }).catch(err =>{
            console.log('generate OTP error:', err)
            res.status(500).json(err);
          })
        }else{
          let updateData = await OtpMaster.findByIdAndUpdate(findEmailInOTPmaster._id, { $set: { OTP: randDigit }});
          sendMail(req, res, randDigit)
        }
        
      }else{
        res.status(400).json('Email Id already exists.');
      }
    }else{
      res.status(400).json('User Name already exists.');
    }
  }catch(err) {
    console.log('catcherr',err);
    res.status(500).json(err);
  }
}

const sendMail = async(req, res, otp)=>{
  var transporter = nodemailer.createTransport({
      // host: 'mail.lcn.com',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      // service: 'gmail',
      auth: {
          user: 'notasom1@gmail.com',
          pass: 'notagoodpassword1'
      }
  });

  var mailOptions = {
    from: '"support@remotereq.com" <notasom1@gmail.com>',
    to: req.body.email,
    subject: 'RemoteReq: Verify Email Id!',
    html: '<p>Your OTP is: '+otp+'</p><p>Thanks and Regards,</p><p>Team RemoteReq</p>',
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log("error: Unable to send email.", error);
      res.status(500).json("Server Error. Please try again.");
    } else {
      // console.log('Email sent: ' + info.response);
      res.status(200).json("OTP is sent to your email id. Please verify.");
    }
  });
}
  
const verifyCredentials = async(req, res)=>{
  try {
    // let getUserData = await User.findOne({ 'username': req.body.username });
    let getUserData = await User.findOne({ $or: [
      {'username': req.body.emailOrUserName}, {'email': req.body.emailOrUserName}
    ] });
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
      res.status(400).json('Email or UserName is not found. please check.');
    }
    
  } catch(err) {
    res.status(500).json(err);
  }
}

const generateResetToken = async(req, res)=>{
  try {
    let getUserData = await User.findOne({ 'email': req.body.email });
    if(getUserData != null){
      
      let resetToken = await authorisation.resetTokenGenerate(getUserData);
      // res.status(200).send(resetToken)
      var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'notasom1@gmail.com',
            pass: 'notagoodpassword1'
        }
      });
    
      var mailOptions = {
        from: '"support@remotereq.com" <notasom1@gmail.com>',
        to: req.body.email,
        subject: 'RemoteReq: Reset your password!',
        html: '<p>Please click this link to reset your password <a target="_blank"  href="http://18.217.254.98/resetpassword?resetToken='+resetToken+'">http://18.217.254.98/resetpassword?resetToken='+resetToken+'</a></p><p><b>**Note: </b>Link validity only for 15 minutes</p>',
      };
    
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log("error: Unable to send email for reset password.", error);
          res.status(500).json("Server Error. Please try again.");
        } else {
          // console.log('Email sent: ' + info.response);
          res.status(200).json("A link is shared to your email id. Please check it.");
        }
      });

      
    }else{
      res.status(400).json('Email id is not found in our system. please check.');
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


const resetPassword = async(req, res)=>{
  try{
    // console.log(req.body.userId)
    let salt = await bcrypt.genSalt(saltRounds);
    let hashPassword = await bcrypt.hash(req.body.newPassword, salt);
    let updateData = await User.findByIdAndUpdate(req.body.userId, { $set: {password: hashPassword}});
    
    
    // res.status(200).json(updateData);
    res.status(200).json("Password reset successfully");
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
  getSingleUserDetails,
  sendOTP,
  generateResetToken,
  resetPassword
};