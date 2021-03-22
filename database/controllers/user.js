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
            fullName: req.body.fullName,
            email: req.body.email,
            authSignature: '',

            // title: '',
            title: [],
            location: '',
            availability: '',
            causes: [],
            jobType: '',
            soonestJoinDate: null,
            fluentInEnglish: null,
            eligibleToWorkInUS: null,

            highestEducationLevel: '',
            reasonForCause: '',
            availableWorkHours: '',
            timeZone: '',
            hourlyWage: null,
            salary: null,
            projectDescription: '',
            sampleProjectLink: '',
            relavantCertificates: '',
            // isWorkRemotely: null,
            aboutMe: '',
            projectDescription: '',
            totalExperience: null,
            desireKeySkills: [],
            

            linkedInURL: '',
            personalURL: '',
            mobileNum: '',
            howLongWorkingRemotely: null, 
            otherLanguages: [],
            refferedBy: '',
            profilePicUrl: '',
            resumePath: '',
            
            // address: '',
          });
  
          //save user's details
          user.save()
          .then(doc => {
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
    from: process.env.EMAIL_USERNAME,
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
        from: process.env.EMAIL_USERNAME,
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
      await sendMailAfterUpdateProfile(getUserData.fullName, getUserData.email);
      getUserData = await User.findById(req.userId).select("-_id -__v -password -authSignature -isEmailVerify -isDeleteAccount");
    }
    res.status(200).json(getUserData);
  } catch(err) {
      console.log(err);
  }
}

const sendMailAfterUpdateProfile = (fullname, emailId)=>{
  let firstName = fullname.split(" ")[0];
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
    from: process.env.EMAIL_USERNAME,
    to: emailId,
    subject: 'Thank you for completing your job seeker questionnaire - RemoteReq',
    html: '<div style="font-family: \'Open Sans\', sans-serif; padding: 15px;"><p>Hey <b>'+firstName+'</b>,</p><p>Thank you for completing your job seeker questionnaire.</p><p>Our small but mighty team is working daily to put your profile in front of potential employers. For some job seekers, this process will move quickly, even immediately. For others, it may take a while.</p><p>Our supply of jobs will ebb and flow with the hiring needs of our employer partners. We work in service of them, and you. Both responsibilities we take seriously.</p><p>Also, we are exploring new relationships and strategies to bring you even more opportunities in the coming weeks. Stay tuned for more updates.</p><p>Lastly, we appreciate your passion, and ask for your patience. We encourage you to visit the <b>Job Seeker section</b> of our <u style="color:blue">Frequently Asked Questions</u> for more information about what we do, and what you can expect.</p><p>Thank you, again, for joining our network of remote talent. More to come soon.</p><p>In solidarity,</p><p><img src="https://remotereq.s3.us-east-2.amazonaws.com/remotereqlogo.JPG"></p><p style="font-size:11px; margin-top: -15px;">Work from Anywhere. Change the World.</p><h5 style="font-weight:normal">e: <a href="javascript:void(0)" >remotereq@gmail.com</a><br> w: <a target="_blank" href="www.remotereq.com">www.remotereq.com</a></h5><ul style="list-style: none;padding-left: 0;"><li style="float: left;margin-right: 3px;"><a href="https://www.facebook.com/RemoteReq-1833060860134583" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/facebook-512.png" style="width: 100%;"/> </a></li><li style="float: left;margin-right: 3px;"><a href="https://www.linkedin.com/company/remotereq" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/linkedin-512.png"  style="width: 100%;"/></a></li><li style="float: left;margin-right: 3px;"><a href="" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/twitter-512.png" style="width: 100%;"/></a></li></ul></div>'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log("error: Unable to send email.", error);
    } else {
      console.log('Email sent after update profile');
    }
  });

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
    let specialPrivilegeIDs = process.env.SPECIAL_PRIVILEGE_IDS.split(",")
    if(getUserData.availability == 'Remote'){
      // console.log('Remote')
      getJobsList = await Jobs.find({ 
        $and: [ 
          { title : { $in: getUserData.title}},
          { location : getUserData.location},
          { $or: [ { availability: 'Remote' }, { availability: 'Flexible' }]  },
          { cause : { $in: getUserData.causes}},
          { jobType: getUserData.jobType },
          { addBy: { $nin: specialPrivilegeIDs } }
        ] 
      })
      .select("-__v -transactionDetails -expireDate -expireStatus -seventhDayAfterExpireDate -hiredStatus -hiringPaymentStatus -numberOfCandidate -percentageMatch -addBy")
      .lean()
      
      matchingPercentage(req, res, getJobsList, getUserData)
    }else if(getUserData.availability == 'On-site'){
      // console.log('On-site')
      getJobsList = await Jobs.find({ 
        $and: [ 
          { title : { $in: getUserData.title}},
          { location : getUserData.location},
          { $or: [ { availability: 'On-site' }, { availability: 'Flexible' }]  },
          { cause : { $in: getUserData.causes}},
          { jobType: getUserData.jobType },
          { addBy: { $nin: specialPrivilegeIDs } }
        ] 
      })
      .select("-__v -transactionDetails -expireDate -expireStatus -seventhDayAfterExpireDate -hiredStatus -hiringPaymentStatus -numberOfCandidate -percentageMatch -addBy")
      .lean()
      
      matchingPercentage(req, res, getJobsList, getUserData)
    }else{
      // console.log('Flexible')
      getJobsList = await Jobs.find({ 
        $and: [ 
          { title : { $in: getUserData.title}},
          { location : getUserData.location},
          { cause : { $in: getUserData.causes}},
          { jobType: getUserData.jobType },
          { addBy: { $nin: specialPrivilegeIDs } }
        ] 
      })
      .select("-__v -transactionDetails -expireDate -expireStatus -seventhDayAfterExpireDate -hiredStatus -hiringPaymentStatus -numberOfCandidate -percentageMatch -addBy")
      .lean()
      
      matchingPercentage(req, res, getJobsList, getUserData)
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
  // let toalPoints = 23;
  const majorQuestionPoints = 85;
  const numberOfMinorQuestions = 15;
  const minorQuestionPoints = ( 15 / numberOfMinorQuestions );

  for(var i=0; i<getJobsList.length; i++){
    var givePoints = (3*minorQuestionPoints);
    //check education matching
    if(getJobsList[i].requiredEducationLevel <= getUserData.highestEducationLevel){
      givePoints += minorQuestionPoints;
    }
    
    //check working hours matching
    // var candidateWT = getUserData.availableWorkHours.split('-');
    // var employerWT = getJobsList[i].workHours.split('-');
    // if( (parseInt(candidateWT[0])>=parseInt(employerWT[0]) && parseInt(candidateWT[0])<=parseInt(employerWT[1])) || (parseInt(candidateWT[1]) >= parseInt(employerWT[0]) && parseInt(candidateWT[1]) <= parseInt(employerWT[1]))){
    //   givePoints += 1;
    // }
    //check time zone matching
    if(getJobsList[i].timeZone == getUserData.timeZone){
      givePoints += minorQuestionPoints;
    }
    //check hourly pay match
    if(getUserData.hourlyWage <= getJobsList[i].hourlyWage){
      givePoints += minorQuestionPoints;
    }
    if(getUserData.projectDescription != ''){
      givePoints += minorQuestionPoints;
    }
    if(getUserData.sampleProjectLink != ''){
      givePoints += minorQuestionPoints;
    }
    if(getUserData.relavantCertificates != ''){
      givePoints += minorQuestionPoints;
    }
    //check experience
    if(getUserData.totalExperience>=getJobsList[i].minExperience){
      givePoints += minorQuestionPoints;
    }
    //check atleast one key skill match or not
    if(getUserData.desireKeySkills.some((val) => getJobsList[i].keySkills.indexOf(val) !== -1)){
      givePoints += minorQuestionPoints;
    }
    //check join date less than 14 days
    if(Date.parse(getUserData.soonestJoinDate) < Date.parse(getJobsList[i].soonestJoinDate)){
      const date1 = new Date(getUserData.soonestJoinDate);
      const date2 = new Date(getJobsList[i].soonestJoinDate);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if(diffDays <=14){
        givePoints += minorQuestionPoints;
      }
   }
    
    getJobsList[i].matchingPercentage = parseInt(givePoints) + majorQuestionPoints;
  }
  return getJobsList;
}

const pointCalculationOfFT = async(getJobsList, getUserData)=>{
  // let toalPoints = 23;
  const majorQuestionPoints = 85;
  const numberOfMinorQuestions = 15;
  const minorQuestionPoints = ( 15 / numberOfMinorQuestions );
  for(var i=0; i<getJobsList.length; i++){
    var givePoints = (5*minorQuestionPoints); // get auto points for reasonForCause, availableWorkDays, timeZone, hourlyWage, aboutMe
    //check education matching
    if(getJobsList[i].requiredEducationLevel <= getUserData.highestEducationLevel){
      givePoints += minorQuestionPoints;
    }
    //check annual pay match
    if((getUserData.salary - 10000) <= getJobsList[i].salary && (getUserData.salary + 10000) >= getJobsList[i].salary){
      givePoints += minorQuestionPoints;
    }
    if(getUserData.projectDescription != ''){
      givePoints += minorQuestionPoints;
    }
    if(getUserData.sampleProjectLink != ''){
      givePoints += minorQuestionPoints;
    }
    if(getUserData.relavantCertificates != ''){
      givePoints += minorQuestionPoints;
    }
   
    //check experience
    if(getUserData.totalExperience>=getJobsList[i].minExperience){
      givePoints += minorQuestionPoints;
    }
    //check atleast one key skill match or not
    if(getUserData.desireKeySkills.some((val) => getJobsList[i].keySkills.indexOf(val) !== -1)){
      givePoints += minorQuestionPoints;
    }
    
    if(Date.parse(getUserData.soonestJoinDate) < Date.parse(getJobsList[i].soonestJoinDate)){
      const date1 = new Date(getUserData.soonestJoinDate);
      const date2 = new Date(getJobsList[i].soonestJoinDate);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if(diffDays <=14){
        givePoints += minorQuestionPoints;
      }
   }
    getJobsList[i].matchingPercentage = parseInt(givePoints) + majorQuestionPoints;
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

// const updateEmailIdToLowerCase = async(req, res)=>{
//   try {
//     let getUserData = await User.find().select("-__v -password -authSignature -isEmailVerify -isDeleteAccount");
    
//     for(var i=0; i<getUserData.length; i++){
//       let updateData = await User.findByIdAndUpdate(getUserData[i]._id, { $set: { email: getUserData[i].email.toLowerCase() }});
//     }
//     console.log('all updated')
//     let updatedUserData = await User.find().select("-__v -password -authSignature -isEmailVerify -isDeleteAccount");
//     res.status(200).json(updatedUserData);
//   } catch(err) {
//     res.status(500).json(err);
//   }
// }

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
  deleteAccount,
  // updateEmailIdToLowerCase
};