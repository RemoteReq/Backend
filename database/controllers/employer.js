// console.log('FRONTEND_BASE_URL',process.env.FRONTEND_BASE_URL)
var nodemailer = require('nodemailer');
const Employer = require('../models/Employer');
const Job = require('../models/Job');
const User = require('../models/User');
const MatchedJobSeeker = require('../models/MatchedJobSeeker_master')
const gateway = require('../../gateway/connection')
const bcrypt = require('bcrypt');
const authorisation = require('../../server/authentication')
const saltRounds = 10;
const addEmployer = async(req, res) => {
  try {
    let salt = await bcrypt.genSalt(saltRounds);
    let hashPassword = await bcrypt.hash(req.body.password, salt);

    let checkUserName = await Employer.findOne({"username" : req.body.username, isDeleteAccount:false});
    if(checkUserName == null){
      let checkEmail = await Employer.findOne({"email" : req.body.email, isDeleteAccount:false});
      if(checkEmail == null){
        //create new client for brainTree
        let newCustomerOfPaymentGateway = await gateway.customer.create({ 
          firstName: req.body.fullName,
          // lastName: req.body.lastName,
          company: req.body.companyName,
          email: req.body.email,
          // phone: req.body.phone,
          // fax: "614.555.5678",
          // website: "www.example.com"
        })

        // console.log(newCustomerOfPaymentGateway.customer.id)
        
        const employer = new Employer({
          username: req.body.username,
          password: hashPassword,
          email: req.body.email,
          // firstName: req.body.firstName,
          // lastName: req.body.lastName,
          fullName: req.body.fullName,
          authSignature: '',
          companyName: req.body.companyName,
          companyLogo: '',
          companyWebsite: '',
          companyLinkedinURL: '',
          location: '',
          clientIdOfPaymentGateway: newCustomerOfPaymentGateway.customer.id
        });
    
        //save Employer's details
        employer.save()
        .then(doc => {
          // console.log(doc);
          sendMail(req, res, doc)
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

const sendMail = async(req, res, doc)=>{
  let companyName = doc.companyName.toUpperCase() ;

  var transporter = nodemailer.createTransport({
      // host: 'mail.lcn.com',
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
    subject: 'Employer Account Confirmation - RemoteReq',
    html: '<div style="font-family: \'Open Sans\', sans-serif; padding: 15px;"><p>Hey <b>'+companyName+'</b>,</p><p>This email is to confirm an employer account for <b>'+companyName+'</b> has been registered on <a target="_blank" href="www.remotereq.com">RemoteReq.com</a>. If this email was received in error, then unsubscribe <a target="_blank" href="'+process.env.FRONTEND_BASE_URL+'unsubscribe?emailId='+doc.email+'" style="color:#1f3961; text-decoration: none;border-bottom: 1px solid #000;">here</a></p><p><a target="_blank" href="'+process.env.FRONTEND_BASE_URL+'employerEmailVerify?id='+doc._id+'" style="color:#1f3961; text-decoration: none;border-bottom: 1px solid #000;">Click here</a> to add new job req to your profile, or to start interviewing our remote talent—immediately.</p><p>Be well,</p><p><img src="https://remotereq.s3.us-east-2.amazonaws.com/remotereqlogo.JPG"></p><p style="font-size:11px; margin-top: -15px;">Work from Anywhere. Change the World.</p><h5 style="font-weight:normal">e: <a href="javascript:void(0)" >remotereq@gmail.com</a><br> w: <a target="_blank" href="www.remotereq.com">www.remotereq.com</a></h5><ul style="list-style: none;padding-left: 0;"><li style="float: left;margin-right: 3px;"><a href="https://www.facebook.com/RemoteReq-1833060860134583" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/facebook-512.png" style="width: 100%;"/> </a></li><li style="float: left;margin-right: 3px;"><a href="https://www.linkedin.com/company/remotereq" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/linkedin-512.png"  style="width: 100%;"/></a></li><li style="float: left;margin-right: 3px;"><a href="" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/twitter-512.png" style="width: 100%;"/></a></li></ul></div>',
    
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log("error: Unable to send email.", error);
      res.status(500).json("Server Error. Please try again.");
    } else {
      res.status(200).json("Email verification link is sent to your mail id. Please check.");
    }
  });
}

const employerEmailVerify = async(req, res)=>{
  try{
    let updateData = await Employer.findByIdAndUpdate(req.query.id, { $set: {isEmailVerify: true}});
    
    // res.status(200).json(updateData);
    res.status(200).json("Email Verified successfully");
  } catch(err) {
      console.log(err);
      res.status(500).json(err);
  }
}
  
const employerCredVerify = async(req, res)=>{
  try {
    // let getEmpData = await Employer.findOne({ 'username': req.body.username });
    let getEmpData = await Employer.findOne({ 
      $or: [
        {'username': req.body.emailOrUserName}, {'email': req.body.emailOrUserName}
      ],
      isDeleteAccount: false 
  });
    if(getEmpData != null){
      let passwordverify = await bcrypt.compare(req.body.password, getEmpData.password);
      if(passwordverify == true){
        if(getEmpData.isEmailVerify){
          let empDataWithToken = await authorisation.generateTokenForEmp(getEmpData);
          res.status(200).json({
            token: empDataWithToken.token,
            username: empDataWithToken.updateData.username,
            email: empDataWithToken.updateData.email,
            clientIdOfPaymentGateway: empDataWithToken.updateData.clientIdOfPaymentGateway
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



const updateEmployerProfile = async(req, res)=>{
  try{
    
    let updateData = await Employer.findByIdAndUpdate(req.employerId, { $set: req.body});
    let getUserData = await Employer.findById(req.employerId).select("-_id -__v -password -authSignature -isEmailVerify -isDeleteAccount -clientIdOfPaymentGateway");
    
    res.status(200).json(getUserData);
  } catch(err) {
      console.log(err);
  }
}

const listEmployers = async(req, res)=>{
  try {
    let getData = await Employer.find().select("-password -authSignature -_id -__v -isEmailVerify -isDeleteAccount -clientIdOfPaymentGateway");
    res.status(200).json(getData);
    
  } catch(err) {
    res.status(500).json(err);
  }
}


const getSingleEmployerDetails = async(req, res)=>{
  try{
    
    let getData = await Employer.findById(req.employerId).select("-_id -__v -password -authSignature -isEmailVerify -isDeleteAccount -clientIdOfPaymentGateway");
    
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
  let getJobData = await Job.findById(req.params.jobId).select("-__v -addBy");
  // console.log(getJobData)
  let alreadyMatchedCandidatesList = await MatchedJobSeeker.find({ jobId : req.params.jobId }).select("-_id -__v ");
  if(alreadyMatchedCandidatesList.length == getJobData.numberOfCandidate){
    res.status(200).json(alreadyMatchedCandidatesList);
  }else{
    let getCandidateList= '';
    if(getJobData.eligibleToWorkInUS){
      if(getJobData.fluentInEnglish){
        getCandidateList = await User.aggregate([
          {
            $match: { $and: [
              { eligibleToWorkInUS: getJobData.eligibleToWorkInUS },
              { fluentInEnglish: getJobData.fluentInEnglish },
              {causes: {'$regex':"^"+getJobData.cause, '$options': 'i'}},
              { jobType: getJobData.jobType },
              { soonestJoinDate: { $lte: getJobData.soonestJoinDate } },
              { isDeleteAccount: false }
            ]}
          },
          {
            $project: {
              causes: 1,
              desireKeySkills: 1,
              location: 1,
              otherLanguages: 1,
              fullName: 1,
              email: 1,
              eligibleToWorkInUS: 1,
              soonestJoinDate: 1,
              fluentInEnglish: 1,
              highestEducationLevel: 1,
              jobChangeReason: 1,
              availableWorkHours: 1,
              timeZone: 1,
              hourlyWage: 1,
              salary: 1,
              projectDescription: 1,
              sampleProjectLink: 1,
              relavantCertificates: 1,
              isWorkRemotely: 1,
              aboutMe: 1,
              totalExperience: 1,
              linkedInURL: 1,
              personalURL: 1,
              mobileNum: 1,
              howLongWorkingRemotely: 1,
              refferedBy: 1,
              profilePicUrl: 1,
              resumePath: 1,
              address: 1,
              // pincode: 1,
              jobType: 1
            }
          }
        ])
        // console.log('yes-yes')
        matchingPercentageCalculation(req, res, getCandidateList, getJobData, alreadyMatchedCandidatesList);
      }else{
        getCandidateList = await User.aggregate([
          {
            $match: { $and: [
              { eligibleToWorkInUS: getJobData.eligibleToWorkInUS },
              {causes: {'$regex':"^"+getJobData.cause, '$options': 'i'}},
              { jobType: getJobData.jobType },
              { soonestJoinDate: { $lte: getJobData.soonestJoinDate } },
              { isDeleteAccount: false }
            ]}
          },
          {
            $project: {
              causes: 1,
              desireKeySkills: 1,
              location: 1,
              otherLanguages: 1,
              fullName: 1,
              email: 1,
              eligibleToWorkInUS: 1,
              soonestJoinDate: 1,
              fluentInEnglish: 1,
              highestEducationLevel: 1,
              jobChangeReason: 1,
              availableWorkHours: 1,
              timeZone: 1,
              hourlyWage: 1,
              salary: 1,
              projectDescription: 1,
              sampleProjectLink: 1,
              relavantCertificates: 1,
              isWorkRemotely: 1,
              aboutMe: 1,
              totalExperience: 1,
              linkedInURL: 1,
              personalURL: 1,
              mobileNum: 1,
              howLongWorkingRemotely: 1,
              refferedBy: 1,
              profilePicUrl: 1,
              resumePath: 1,
              address: 1,
              // pincode: 1,
              jobType: 1
            }
          }
        ])
        // console.log('yes-no')
        matchingPercentageCalculation(req, res, getCandidateList, getJobData, alreadyMatchedCandidatesList);
      }
    }else{
      if(getJobData.fluentInEnglish){
        getCandidateList = await User.aggregate([
          {
            $match: { $and: [
              { fluentInEnglish: getJobData.fluentInEnglish },
              {causes: {'$regex':"^"+getJobData.cause, '$options': 'i'}},
              { jobType: getJobData.jobType },
              { soonestJoinDate: { $lte: getJobData.soonestJoinDate } },
              { isDeleteAccount: false }
            ]}
          },
          {
            $project: {
              causes: 1,
              desireKeySkills: 1,
              location: 1,
              otherLanguages: 1,
              fullName: 1,
              email: 1,
              eligibleToWorkInUS: 1,
              soonestJoinDate: 1,
              fluentInEnglish: 1,
              highestEducationLevel: 1,
              jobChangeReason: 1,
              availableWorkHours: 1,
              timeZone: 1,
              hourlyWage: 1,
              salary: 1,
              projectDescription: 1,
              sampleProjectLink: 1,
              relavantCertificates: 1,
              isWorkRemotely: 1,
              aboutMe: 1,
              totalExperience: 1,
              linkedInURL: 1,
              personalURL: 1,
              mobileNum: 1,
              howLongWorkingRemotely: 1,
              refferedBy: 1,
              profilePicUrl: 1,
              resumePath: 1,
              address: 1,
              // pincode: 1,
              jobType: 1
            }
          }
        ])
        // console.log('no-yes')
        matchingPercentageCalculation(req, res, getCandidateList, getJobData, alreadyMatchedCandidatesList);

      }else{
        getCandidateList = await User.aggregate([
          {
            $match: { $and: [
              {causes: {'$regex':"^"+getJobData.cause, '$options': 'i'}},
              { jobType: getJobData.jobType },
              { soonestJoinDate: { $lte: getJobData.soonestJoinDate } },
              { isDeleteAccount: false }
            ]}
          },
          {
            $project: {
              causes: 1,
              desireKeySkills: 1,
              location: 1,
              otherLanguages: 1,
              fullName: 1,
              email: 1,
              eligibleToWorkInUS: 1,
              soonestJoinDate: 1,
              fluentInEnglish: 1,
              highestEducationLevel: 1,
              jobChangeReason: 1,
              availableWorkHours: 1,
              timeZone: 1,
              hourlyWage: 1,
              salary: 1,
              projectDescription: 1,
              sampleProjectLink: 1,
              relavantCertificates: 1,
              isWorkRemotely: 1,
              aboutMe: 1,
              totalExperience: 1,
              linkedInURL: 1,
              personalURL: 1,
              mobileNum: 1,
              howLongWorkingRemotely: 1,
              refferedBy: 1,
              profilePicUrl: 1,
              resumePath: 1,
              address: 1,
              // pincode: 1,
              jobType: 1
            }
          }
        ])
        // console.log('no-no')
        matchingPercentageCalculation(req, res, getCandidateList, getJobData, alreadyMatchedCandidatesList);
      }
    }
  }
}

const matchingPercentageCalculation = async(req, res, getCandidateList, getJobData, alreadyMatchedCandidatesList)=>{
  let getPointsCandidateList = '';
  if(getJobData.jobType == 'Part Time'){
    getPointsCandidateList = await getPointsForHalfTimers(getCandidateList, getJobData);
  }else{
    getPointsCandidateList = await getPointsForFullTimers(getCandidateList, getJobData);
  }
  
  getPointsCandidateList.sort((a, b) => b.matchingPercentage - a.matchingPercentage);
  let filteredList = getPointsCandidateList.filter(data => data.matchingPercentage >= getJobData.percentageMatch);
  
  var updatedFilterList = filteredList.filter(function(o1){
      // filter out (!) items in result2
      return !alreadyMatchedCandidatesList.some(function(o2){
          return o1.candidateId === o2.candidateId;          // assumes unique id
      });
  });

  // var matchedIds = alreadyMatchedCandidatesList.map(d => d.candidateId);
  // console.log('matchedIds',matchedIds)

  // var updatedFilterList = [];
  // updatedFilterList = filteredList.filter(function(element){
  //   console.log(typeof element.candidateId)
  //   console.log(element.candidateId)
  //   console.log(matchedIds.indexOf(element.candidateId))
  //   return matchedIds.indexOf(element.candidateId) == -1;
  // });

  // console.log(updatedFilterList)
  updatedFilterList = updatedFilterList.slice(0, (getJobData.numberOfCandidate - alreadyMatchedCandidatesList.length))
  await saveMatchedCandidates(req, res, updatedFilterList, getJobData._id)
}

const saveMatchedCandidates = async(req, res, updatedFilterList)=>{
  MatchedJobSeeker.insertMany(updatedFilterList).then(async function(){ 
      console.log("Latest Matched Job Seekers Data inserted ")  // Success 
      let getMatchedList = await MatchedJobSeeker.find({ jobId : req.params.jobId }).select("-_id -__v ");
      res.status(200).json(getMatchedList);
  }).catch(function(error){ 
      console.log('Error in bulk insert matched job seekers',error)      // Failure 
  });
}

const getPointsForHalfTimers = async(getCandidateList, getJobData)=>{
  let toalPoints = 23;
  for(var i=0; i<getCandidateList.length; i++){
    let givePoints = 3; // get auto points for jobChangeReason, salary, aboutMe
    //check education matching
    if(getJobData.requiredEducationLevel <= getCandidateList[i].highestEducationLevel){
      givePoints += 1;
    }
    
    //check working hours matching
    var candidateWT = getCandidateList[i].availableWorkHours.split('-');
    var employerWT = getJobData.workHours.split('-');
    if( (parseInt(candidateWT[0])>=parseInt(employerWT[0]) && parseInt(candidateWT[0])<=parseInt(employerWT[1])) || (parseInt(candidateWT[1]) >= parseInt(employerWT[0]) && parseInt(candidateWT[1]) <= parseInt(employerWT[1]))){
      givePoints += 1;
    }
    //check time zone matching
    if(getJobData.timeZone == getCandidateList[i].timeZone){
      givePoints += 1;
    }
    //check hourly pay match
    if(getCandidateList[i].hourlyWage <= getJobData.hourlyWage){
      givePoints += 1;
    }
    if(getCandidateList[i].projectDescription != ''){
      givePoints += 1;
    }
    if(getCandidateList[i].sampleProjectLink != ''){
      givePoints += 1;
    }
    if(getCandidateList[i].relavantCertificates != ''){
      givePoints += 1;
    }
    if(getCandidateList[i].isWorkRemotely){
      givePoints += 1;
    }
    //check experience
    if(getCandidateList[i].totalExperience>=getJobData.minExperience){
      givePoints += 4;
    }
    //check atleast one key skill match or not
    if(getCandidateList[i].desireKeySkills.some((val) => getJobData.keySkills.indexOf(val) !== -1)){
      givePoints += 4;
    }
    //check location
    // if(getCandidateList[i].location.indexOf(getJobData.location) != -1){
    //   givePoints += 4;
    // }
    if(getCandidateList[i].location == getJobData.location){
      givePoints += 4;
    }
    // getCandidateList[i].givePoints = givePoints
    getCandidateList[i].matchingPercentage = parseInt((givePoints/toalPoints)*100);
    getCandidateList[i].jobId = getJobData._id;
    getCandidateList[i].candidateId = (getCandidateList[i]._id).toString();
    delete getCandidateList[i]._id
  }
  // console.log('complete')
  return getCandidateList;
}

const getPointsForFullTimers = async(getCandidateList, getJobData)=>{
  let toalPoints = 23;
  for(var i=0; i<getCandidateList.length; i++){
    let givePoints = 6; // get auto points for jobChangeReason, availableWorkDays, availableWorkHours, timeZone, hourlyWage, aboutMe
    //check education matching
    if(getJobData.requiredEducationLevel <= getCandidateList[i].highestEducationLevel){
      givePoints += 1;
    }
    
    //check annual pay match
    if(getCandidateList[i].salary <= getJobData.salary){
      givePoints += 1;
    }
    if(getCandidateList[i].projectDescription != ''){
      givePoints += 1;
    }
    if(getCandidateList[i].sampleProjectLink != ''){
      givePoints += 1;
    }
    if(getCandidateList[i].relavantCertificates != ''){
      givePoints += 1;
    }
    if(getCandidateList[i].isWorkRemotely){
      givePoints += 1;
    }
    //check experience
    if(getCandidateList[i].totalExperience>=getJobData.minExperience){
      givePoints += 4;
    }
    //check atleast one key skill match or not
    if(getCandidateList[i].desireKeySkills.some((val) => getJobData.keySkills.indexOf(val) !== -1)){
      givePoints += 4;
    }
    //check location
    // if(getCandidateList[i].location.indexOf(getJobData.location) != -1){
    //   givePoints += 4;
    // }
    if(getCandidateList[i].location == getJobData.location){
      givePoints += 4;
    }
    // getCandidateList[i].givePoints = givePoints
    getCandidateList[i].matchingPercentage = parseInt((givePoints/toalPoints)*100);
    getCandidateList[i].jobId = getJobData._id;
    getCandidateList[i].candidateId = (getCandidateList[i]._id).toString();
    delete getCandidateList[i]._id
  }
  // console.log('complete')
  return getCandidateList;
}

const deleteAccount = async(req, res)=>{
  try{
    // console.log(req.employerId)
    let updateData = await Employer.findByIdAndUpdate(req.employerId, { $set: {isDeleteAccount: true}});
    res.status(200).json("Removed your account");
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
  matchesCandidateByEachJob,
  employerEmailVerify,
  deleteAccount,
  updateEmployerProfile
};