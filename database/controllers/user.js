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

    // let verifyEmail = await OtpMaster.findOne({"emailId" : req.body.email, "OTP": req.body.otp});
    // console.log(verifyEmail)
    let checkUserName = await User.findOne({"username" : req.body.username, isDeleteAccount: false});
    if(checkUserName == null){
      let checkEmail = await User.findOne({"email" : req.body.email, isDeleteAccount: false});
      if(checkEmail == null){
      // if(verifyEmail != null){
          const user = new User({
            username: req.body.username,
            password: hashPassword,
            // firstName: req.body.firstname,
            // lastName: req.body.lastname,
            fullName: req.body.fullName,
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
            // res.status(200).json('Signed up successfully done');
            sendMail(req, res, doc)
          })
          .catch(error => {
            console.log('ERROR 💥:', error)
            res.status(500).json(error);
          });

      }else{
        // res.status(400).json('OTP not matched. Please try again.');
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

// const sendOTP = async(req, res)=>{
//   try{
//     let checkUserName = await User.findOne({"username" : req.body.username});
//     if(checkUserName == null){
//       let checkEmail = await User.findOne({"email" : req.body.email});
//       if(checkEmail == null){
//         let randDigit = Math.floor(100000 + Math.random() * 900000);
//         let findEmailInOTPmaster = await OtpMaster.findOne({"emailId" : req.body.email});
//         // console.log(findEmailInOTPmaster)
//         if(findEmailInOTPmaster == null){
//           const otpMaster = new OtpMaster({
//             OTP: randDigit,
//             emailId: req.body.email
//           })
    
//           otpMaster.save().then(data =>{
//             sendMail(req, res, randDigit)
//           }).catch(err =>{
//             console.log('generate OTP error:', err)
//             res.status(500).json(err);
//           })
//         }else{
//           let updateData = await OtpMaster.findByIdAndUpdate(findEmailInOTPmaster._id, { $set: { OTP: randDigit }});
//           sendMail(req, res, randDigit)
//         }
        
//       }else{
//         res.status(400).json('Email Id already exists.');
//       }
//     }else{
//       res.status(400).json('User Name already exists.');
//     }
//   }catch(err) {
//     console.log('catcherr',err);
//     res.status(500).json(err);
//   }
// }

// const sendMail = async(req, res, otp)=>{
const sendMail = async(req, res, doc)=>{
  var transporter = nodemailer.createTransport({
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
    subject: 'RemoteReq: Email Verification!',
    // html: '<p>Hey '+doc.fullName+',</p><p>This email is to confirm your job seeker account for '+doc.fullName+' has been registered on RemoteReq.com. If this email was received in error, then unsubscribe <a target="_blank"  href="http://18.217.254.98/unsubscribeUser?id='+doc._id+'">here</a>.</p><p><a target="_blank" href="http://18.217.254.98/userEmailVerify?id='+doc._id+'">Click here</a> to visit your account or update your profile.</p><p>Be well,</><p><b>RemoteReq</b> | Remote work with purpose.</><h5 style="font-weight:normal">Visit us online, or follow us on social media. </br> <a target="_blank" href="www.remotereq.com">www.remotereq.com</a></h5>',
    html: '<div style="font-family: \'Open Sans\', sans-serif; padding: 15px;"><p>Hey '+doc.fullName+',</p><p>This email is to confirm your job seeker account for '+doc.fullName+' has been registered on RemoteReq.com. If this email was received in error, then unsubscribe <a target="_blank" href="http://18.217.254.98/unsubscribeUser?id='+doc._id+'" style="color:#1f3961; text-decoration: none;border-bottom: 1px solid #000;">here</a></p><p><a target="_blank" href="http://18.217.254.98/userEmailVerify?id='+doc._id+'" style="color:#1f3961; text-decoration: none;border-bottom: 1px solid #000;">Click here</a> to visit your account or update your profile.</p><p>Be well,</p><p style="color:#1f3961";><b>RemoteReq</b> | Remote work with purpose.</p><h5 style="font-weight:normal">Visit us online, or follow us on social media.</br> <a target="_blank" href="www.remotereq.com">www.remotereq.com</a></h5><ul style="list-style: none;padding-left: 0;"><li style="float: left;margin-right: 3px;"><a href="https://www.facebook.com/RemoteReq-1833060860134583" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/facebook-512.png" style="width: 100%;"/> </a></li><li style="float: left;margin-right: 3px;"><a href="https://www.linkedin.com/company/remotereq" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/linkedin-512.png"  style="width: 100%;"/></a></li><li style="float: left;margin-right: 3px;"><a href="" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/twitter-512.png" style="width: 100%;"/></a></li></ul></div>',
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log("error: Unable to send email.", error);
      res.status(500).json("Server Error. Please try again.");
    } else {
      // console.log('Email sent: ' + info.response);
      // res.status(200).json("OTP is sent to your email id. Please verify.");
      res.status(200).json("Email verification link is sent to your mail id. Please check.");
    }
  });
}

const userEmailVerify = async(req, res)=>{
  try{
    let updateData = await User.findByIdAndUpdate(req.query.id, { $set: {isEmailVerify: true}});
    
    // res.status(200).json(updateData);
    res.status(200).json("Email Verified successfully");
  } catch(err) {
      console.log(err);
      res.status(500).json(err);
  }
}
  
const verifyCredentials = async(req, res)=>{
  try {
    // let getUserData = await User.findOne({ 'username': req.body.username });
    let getUserData = await User.findOne({ 
      isDeleteAccount: false,
      $or: [
        {'username': req.body.emailOrUserName}, {'email': req.body.emailOrUserName}
      ] 
    });
    if(getUserData != null){
      let passwordverify = await bcrypt.compare(req.body.password, getUserData.password);
      if(passwordverify == true){
        if(getUserData.isEmailVerify){
          let userDataWithToken = await authorisation.generateToken(getUserData);
          res.status(200).json({
            token: userDataWithToken.token,
            username: userDataWithToken.updateData.username,
            // firstName: userDataWithToken.updateData.firstName,
            // lastName: userDataWithToken.updateData.lastName,
            fullName: userDataWithToken.updateData.fullName,
            email: userDataWithToken.updateData.email
          });
        }else{
          res.status(400).json('First verify your email please.');
        }
        
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
    let getUserData = await User.findById(req.userId).select("-_id -__v -password -authSignature -isEmailVerify -isDeleteAccount");
    
    res.status(200).json(getUserData);
  } catch(err) {
      console.log(err);
  }
}

const updateUserProfile = async(req, res)=>{
  try{
    
    let updateData = await User.findByIdAndUpdate(req.userId, { $set: req.body});
    let getUserData = await User.findById(req.userId).select("-_id -__v -password -authSignature -isEmailVerify -isDeleteAccount");
    
    res.status(200).json(getUserData);
  } catch(err) {
      console.log(err);
  }
}

const listUsers = async(req, res)=>{
  try {
    let getUserData = await User.find().select("-_id -__v -password -authSignature -isEmailVerify -isDeleteAccount");
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
    
    let getUserData = await User.findById(req.userId).select("-_id -__v -password -authSignature -isEmailVerify -isDeleteAccount");
    
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

const deleteAccount = async(req, res)=>{
  try{
    let updateData = await User.findByIdAndUpdate(req.userId, { $set: {isDeleteAccount: true}});
    res.status(200).json("Removed your account");
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
  // sendOTP,
  generateResetToken,
  resetPassword,
  userEmailVerify,
  deleteAccount
};