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

            eligibleToWorkInUS: null,
            causes: [],
            jobType: '',
            soonestJoinDate: null,
            fluentInEnglish: null,

            highestEducationLevel: '',
            jobChangeReason: '',
            availableWorkHours: '',
            timeZone: '',
            hourlyWage: null,
            salary: null,
            projectDescription: '',
            sampleProjectLink: '',
            relavantCertificates: '',
            isWorkRemotely: null,
            aboutMe: '',
            projectDescription: '',
            totalExperience: null,
            desireKeySkills: [],
            location: '',

            linkedInURL: '',
            personalURL: '',
            mobileNum: '',
            howLongWorkingRemotely: null, 
            otherLanguages: [],
            refferedBy: '',
            profilePicUrl: '',
            resumePath: '',
            
            address: '',
            // pincode: '',
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


// const sendMail = async(req, res, otp)=>{
const sendMail = async(req, res, doc)=>{
  let fullName = doc.fullName.toUpperCase();
  let fullNameArr = fullName.split(" ");
  let firstName = fullNameArr[0];
  var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      // service: 'gmail',
      auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
      }
  });

  var mailOptions = {
    from: '"support@remotereq.com" <'+process.env.EMAIL_USERNAME+'>',
    to: req.body.email,
    subject: 'Job Seeker Account Confirmation - RemoteReq',
    html: '<div style="font-family: \'Open Sans\', sans-serif; padding: 15px;"><p>Hey <b>'+firstName+'</b>,</p><p>This email is to confirm a job seeker account for <b>'+fullName+'</b> has been registered on <a target="_blank" href="www.remotereq.com">RemoteReq.com</a>. If this email was received in error, then unsubscribe <a target="_blank" href="'+process.env.FRONTEND_BASE_URL+'unsubscribe?emailId='+doc.email+'" style="color:#1f3961; text-decoration: none;border-bottom: 1px solid #000;">here</a></p><p><a target="_blank" href="'+process.env.FRONTEND_BASE_URL+'userEmailVerify?id='+doc._id+'" style="color:#1f3961; text-decoration: none;border-bottom: 1px solid #000;">Click here</a> to visit your account or update your profile.</p><p>Be well,</p><p><img src="https://remotereq.s3.us-east-2.amazonaws.com/remotereqlogo.JPG"></p><p style="font-size:11px; margin-top: -15px;">Work from Anywhere. Change the World.</p><h5 style="font-weight:normal">e: <a href="javascript:void(0)" >remotereq@gmail.com</a><br> w: <a target="_blank" href="www.remotereq.com">www.remotereq.com</a></h5><ul style="list-style: none;padding-left: 0;"><li style="float: left;margin-right: 3px;"><a href="https://www.facebook.com/RemoteReq-1833060860134583" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/facebook-512.png" style="width: 100%;"/> </a></li><li style="float: left;margin-right: 3px;"><a href="https://www.linkedin.com/company/remotereq" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/linkedin-512.png"  style="width: 100%;"/></a></li><li style="float: left;margin-right: 3px;"><a href="" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/twitter-512.png" style="width: 100%;"/></a></li></ul></div>'
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
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    
      var mailOptions = {
        from: '"support@remotereq.com" <'+process.env.EMAIL_USERNAME+'>',
        to: req.body.email,
        subject: 'RemoteReq: Reset your password!',
        html: '<p>Please click this link to reset your password <a target="_blank"  href="'+process.env.FRONTEND_BASE_URL+'resetpassword?resetToken='+resetToken+'">'+process.env.FRONTEND_BASE_URL+'resetpassword?resetToken='+resetToken+'</a></p><p><b>**Note: </b>Link validity only for 15 minutes</p>',
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



// const desireJob = async(req, res)=>{
//   try{
//     let updateData = await User.findByIdAndUpdate(req.userId, { $set: req.body});
//     let getUserData = await User.findById(req.userId).select("-_id -__v -password -authSignature -isEmailVerify -isDeleteAccount");
    
//     res.status(200).json(getUserData);
//   } catch(err) {
//       console.log(err);
//   }
// }

const updateUserProfile = async(req, res)=>{
  try{
    
    let updateData = await User.findByIdAndUpdate(req.userId, { $set: req.body});
    let getUserData = await User.findById(req.userId).select("-_id -__v -password -authSignature -isEmailVerify -isDeleteAccount");
    // console.log(getUserData.eligibleToWorkInUS)
    if(getUserData.eligibleToWorkInUS !== null && getUserData.causes.length !== 0 && getUserData.soonestJoinDate !== null && getUserData.jobType !== '' && getUserData.fluentInEnglish !== null){
      await User.findByIdAndUpdate(req.userId, { $set: { profileCompleteStatus: true }});
      getUserData = await User.findById(req.userId).select("-_id -__v -password -authSignature -isEmailVerify -isDeleteAccount");
    }
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
    let getJobsList = '';
    if(getUserData.eligibleToWorkInUS){
      if(getUserData.fluentInEnglish){
        getJobsList = await Jobs.find({ 
          $and: [ 
            { cause : { $in: getUserData.causes}},
            { jobType: getUserData.jobType },
            { soonestJoinDate: { $gte: getUserData.soonestJoinDate } },
            { expireStatus: false }
          ] 
        }).select("-__v -transactionDetails -expireDate -expireStatus -seventhDayAfterExpireDate -hiredStatus -hiringPaymentStatus -addBy -numberOfCandidate -percentageMatch")
        .lean()
        
        matchingPercentage(req, res, getJobsList, getUserData)
      }else{
        getJobsList = await Jobs.find({ 
          $and: [ 
            { cause : { $in: getUserData.causes}},
            { jobType: getUserData.jobType },
            { soonestJoinDate: { $gte: getUserData.soonestJoinDate } },
            { fluentInEnglish: getUserData.fluentInEnglish },
            { expireStatus: false }
          ] 
        })
        .select("-__v -transactionDetails -expireDate -expireStatus -seventhDayAfterExpireDate -hiredStatus -hiringPaymentStatus -addBy -numberOfCandidate -percentageMatch")
        .lean()  //lean helps addition of new fields in find query

        matchingPercentage(req, res, getJobsList, getUserData)
      }
    }else{
      if(getUserData.fluentInEnglish){
        getJobsList = await Jobs.find({ 
          $and: [ 
            { cause : { $in: getUserData.causes}},
            { jobType: getUserData.jobType },
            { soonestJoinDate: { $gte: getUserData.soonestJoinDate } },
            { eligibleToWorkInUS: getUserData.eligibleToWorkInUS },
            { expireStatus: false }
          ] 
        }).select("-__v -transactionDetails -expireDate -expireStatus -seventhDayAfterExpireDate -hiredStatus -hiringPaymentStatus -addBy -numberOfCandidate -percentageMatch")
        .lean()
        
        matchingPercentage(req, res, getJobsList, getUserData)
      }else{
        getJobsList = await Jobs.find({ 
          $and: [ 
            { cause : { $in: getUserData.causes}},
            { jobType: getUserData.jobType },
            { soonestJoinDate: { $gte: getUserData.soonestJoinDate } },
            { eligibleToWorkInUS: getUserData.eligibleToWorkInUS },
            { fluentInEnglish: getUserData.fluentInEnglish },
            { expireStatus: false }
          ] 
        }).select("-__v -transactionDetails -expireDate -expireStatus -seventhDayAfterExpireDate -hiredStatus -hiringPaymentStatus -addBy -numberOfCandidate -percentageMatch")
        .lean()
        
        matchingPercentage(req, res, getJobsList, getUserData)
      }
    }
    
  }catch(err){
    console.log(err);
  }
}

const matchingPercentage = async(req, res, getJobsList, getUserData)=>{
  let jobListWithPercentageVal = '';
  if(getUserData.jobType == 'Part Time'){
    jobListWithPercentageVal = await pointCalculationOfHT(getJobsList, getUserData);
  }else{
    jobListWithPercentageVal = await pointCalculationOfFT(getJobsList, getUserData);
  }
  // res.send(getUserData)
  res.send(jobListWithPercentageVal)
}

const pointCalculationOfHT = async(getJobsList, getUserData)=>{
  let toalPoints = 23;
  for(var i=0; i<getJobsList.length; i++){
    var givePoints = 3;
    //check education matching
    if(getJobsList[i].requiredEducationLevel <= getUserData.highestEducationLevel){
      givePoints += 1;
    }
    
    //check working hours matching
    var candidateWT = getUserData.availableWorkHours.split('-');
    var employerWT = getJobsList[i].workHours.split('-');
    if( (parseInt(candidateWT[0])>=parseInt(employerWT[0]) && parseInt(candidateWT[0])<=parseInt(employerWT[1])) || (parseInt(candidateWT[1]) >= parseInt(employerWT[0]) && parseInt(candidateWT[1]) <= parseInt(employerWT[1]))){
      givePoints += 1;
    }
    //check time zone matching
    if(getJobsList[i].timeZone == getUserData.timeZone){
      givePoints += 1;
    }
    //check hourly pay match
    if(getUserData.hourlyWage <= getJobsList[i].hourlyWage){
      givePoints += 1;
    }
    if(getUserData.projectDescription != ''){
      givePoints += 1;
    }
    if(getUserData.sampleProjectLink != ''){
      givePoints += 1;
    }
    if(getUserData.relavantCertificates != ''){
      givePoints += 1;
    }
    if(getUserData.isWorkRemotely){
      givePoints += 1;
    }
    //check experience
    if(getUserData.totalExperience>=getJobsList[i].minExperience){
      givePoints += 4;
    }
    //check atleast one key skill match or not
    if(getUserData.desireKeySkills.some((val) => getJobsList[i].keySkills.indexOf(val) !== -1)){
      givePoints += 4;
    }
    //check location
    // if(getUserData.location.indexOf(getJobsList[i].location) != -1){
    //   givePoints += 4;
    // }
    if(getUserData.location == getJobsList[i].location){
      givePoints += 4;
    }
    // getJobsList[i].givePoints = givePoints
    getJobsList[i].matchingPercentage = parseInt((givePoints/toalPoints)*100)
  }
  return getJobsList;
}

const pointCalculationOfFT = async(getJobsList, getUserData)=>{
  let toalPoints = 23;
  for(var i=0; i<getJobsList.length; i++){
    var givePoints = 6; // get auto points for jobChangeReason, availableWorkDays, availableWorkHours, timeZone, hourlyWage, aboutMe
    //check education matching
    if(getJobsList[i].requiredEducationLevel <= getUserData.highestEducationLevel){
      givePoints += 1;
    }
    //check annual pay match
    if(getUserData.salary <= getJobsList[i].salary){
      givePoints += 1;
    }
    if(getUserData.projectDescription != ''){
      givePoints += 1;
    }
    if(getUserData.sampleProjectLink != ''){
      givePoints += 1;
    }
    if(getUserData.relavantCertificates != ''){
      givePoints += 1;
    }
    if(getUserData.isWorkRemotely){
      givePoints += 1;
    }
    //check experience
    if(getUserData.totalExperience>=getJobsList[i].minExperience){
      givePoints += 4;
    }
    //check atleast one key skill match or not
    if(getUserData.desireKeySkills.some((val) => getJobsList[i].keySkills.indexOf(val) !== -1)){
      givePoints += 4;
    }
    //check location
    // if(getUserData.location.indexOf(getJobsList[i].location) != -1){
    //   givePoints += 4;
    // }
    if(getUserData.location == getJobsList[i].location){
      givePoints += 4;
    }
    
    getJobsList[i].matchingPercentage = parseInt((givePoints/toalPoints)*100)
  }
  return getJobsList;
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
  // desireJob,
  filterJobs,
  updateUserProfile,
  getSingleUserDetails,
  // sendOTP,
  generateResetToken,
  resetPassword,
  userEmailVerify,
  deleteAccount
};