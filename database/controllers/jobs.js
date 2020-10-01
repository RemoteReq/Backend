const Jobs = require('../models/Job');
const Employer = require('../models/Employer');
const User = require('../models/User');
var nodemailer = require('nodemailer');
const gateway = require('../../gateway/connection')
// console.log('gateway', gateway)

const addJob = async(req, res) => {
  let pendingPaymentJobList = await findPendingPayment(req, res);
  if(pendingPaymentJobList.length > 0){
    res.status(400).send('Before post new job please pay your due payment of '+pendingPaymentJobList[0].title);
  }else{
    const job = new Jobs({
      title: req.body.title,
      companyName: req.body.companyName,
      companyLogoPath: req.body.companyLogoPath ? req.body.companyLogoPath : '',
      companyWebsiteUrl: req.body.companyWebsiteUrl ? req.body.companyWebsiteUrl : '',
      jobDetails: req.body.jobDetails,
      jobDescriptionPath: req.body.jobDescriptionPath ? req.body.jobDescriptionPath: '',
      numberOfCandidate: req.body.numberOfCandidate,
      percentageMatch: req.body.percentageMatch,
      addBy: req.employerId,
      // 'transactionDetails.transactionIdForAddJob.transactionId': req.body.transactionIdForAddJob,

      eligibleToWorkInUS: req.body.eligibleToWorkInUS,
      cause: req.body.cause,
      jobType: req.body.jobType,
      soonestJoinDate: req.body.soonestJoinDate,
      fluentInEnglish: req.body.fluentInEnglish,

      requiredEducationLevel: req.body.requiredEducationLevel,
      workDays: req.body.workDays.split(","),
      workHours: req.body.workHours,
      timeZone: req.body.timeZone,
      hourlyWage: req.body.hourlyWage,
      salary: req.body.salary,
      requireCertification: req.body.requireCertification,
      otherLanguages: req.body.otherLanguages.split(","),
      keySkills: req.body.keySkills.split(","),
      minExperience: req.body.minExperience,
      maxExperience: req.body.maxExperience,
      location: req.body.location,

      industryType: req.body.industryType,
    });

    //save user's details
    job.save()
    .then(async(doc) => {
      // res.status(200).json(doc);
      await sendMailAfterJobPost(req, res, req.employerId, req.body.title);
      await checkCandidateMatch(doc)
    })
    .catch(error => {
      console.log('ERROR 💥:', error)
      res.status(500).json(error);
    });
  }
};

const findPendingPayment = async(req, res)=>{
  try {
    let pendingPaymentList = await Jobs.find({addBy: req.employerId, hiredStatus: true, hiringPaymentStatus: null});
    // res.status(200).json(pendingPaymentList);
    return pendingPaymentList;
    
  } catch(err) {
    res.status(500).json(err);
  }
}

const sendMailAfterJobPost = async(req, res, empId, jobTitle)=>{
  let empDetails = await Employer.findById(empId)
  let companyName = empDetails.companyName;

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
    to: empDetails.email,
    subject: 'Remote Job Posting Confirmation - RemoteReq',
    html: '<div style="font-family: \'Open Sans\', sans-serif; padding: 15px;"><p>Hey <b>'+companyName+'</b>,</p><p>This email is to confirm a remote job has been posted for the position of <b>'+jobTitle+'</b> to <a target="_blank" href="www.remotereq.com">RemoteReq.com</a></p><p><b>What happens next?</b><br>You will receive an email when your matches are ready for review. Upon being notified, you will have 21 days to review your matches, interview candidates, and make an offer for your opening. Be on the lookout for more details, coming soon.</p><p><a target="_blank" href="'+process.env.FRONTEND_BASE_URL+'employer/signin">Click here</a> to visit your account or to post another job req.</p><p>Be well,</p><p><img src="https://remotereq.s3.us-east-2.amazonaws.com/remotereqlogo.JPG"></p><p style="font-size:11px; margin-top: -15px;">Work from Anywhere. Change the World.</p><h5 style="font-weight:normal">e: <a href="javascript:void(0)" >remotereq@gmail.com</a><br> w: <a target="_blank" href="www.remotereq.com">www.remotereq.com</a></h5><ul style="list-style: none;padding-left: 0;"><li style="float: left;margin-right: 3px;"><a href="https://www.facebook.com/RemoteReq-1833060860134583" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/facebook-512.png" style="width: 100%;"/> </a></li><li style="float: left;margin-right: 3px;"><a href="https://www.linkedin.com/company/remotereq" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/linkedin-512.png"  style="width: 100%;"/></a></li><li style="float: left;margin-right: 3px;"><a href="" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/twitter-512.png" style="width: 100%;"/></a></li></ul></div>',
    
  };

  transporter.sendMail(mailOptions, async function(error, info){
    if (error) {
      console.log("error: Unable to send email.", error);
    } else {
      console.log('mail send for job post');
      res.send('Job Post Successfully')
    }
  });

}

const checkCandidateMatch = async(getJobData)=>{
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
        }
      ])
      // console.log('yes-yes')
      matchingPercentageCalculation(getCandidateList, getJobData);
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
        }        
      ])
      // console.log('yes-no')
      matchingPercentageCalculation(getCandidateList, getJobData);
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
        }
      ])
      // console.log('no-yes')
      matchingPercentageCalculation(getCandidateList, getJobData);

    }else{
      getCandidateList = await User.aggregate([
        {
          $match: { $and: [
            {causes: {'$regex':"^"+getJobData.cause, '$options': 'i'}},
            { jobType: getJobData.jobType },
            { soonestJoinDate: { $lte: getJobData.soonestJoinDate } },
            { isDeleteAccount: false }
          ]}
        }
      ])
      // console.log('no-no')
      matchingPercentageCalculation(getCandidateList, getJobData);
    }
  }
  
} 

const matchingPercentageCalculation = async(getCandidateList, getJobData)=>{
  let getPointsCandidateList = '';
  if(getJobData.jobType == 'Part Time'){
    getPointsCandidateList = await getPointsForHalfTimers(getCandidateList, getJobData);
  }else{
    getPointsCandidateList = await getPointsForFullTimers(getCandidateList, getJobData);
  }
  // console.log('ok')
  getPointsCandidateList.sort((a, b) => b.matchingPercentage - a.matchingPercentage);
  let filteredList = getPointsCandidateList.filter(data => data.matchingPercentage >= getJobData.percentageMatch).slice(0, getJobData.numberOfCandidate)
  // res.status(200).json(filteredList);
  // console.log('getCandidateList', filteredList)
  if(filteredList.length>0){
    await mailForAfterCandidateMatched(getJobData, getJobData.addBy, filteredList.length);
  }else{
    console.log('Candidates not matched right now')
  }
}

const getPointsForHalfTimers = async(getCandidateList, getJobData)=>{
  let toalPoints = 23;
  for(var i=0; i<getCandidateList.length; i++){
    let givePoints = 3; // get auto points for jobChangeReason, salary, descProfessionalGoal
    //check education matching
    if(getJobData.requiredEducationLevel <= getCandidateList[i].highestEducationLevel){
      givePoints += 1;
    }
    //check working day matching
    if(getCandidateList[i].availableWorkDays.some((val) => getJobData.workDays.indexOf(val) !== -1)){
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
    getCandidateList[i].matchingPercentage = parseInt((givePoints/toalPoints)*100)
  }
  // console.log('complete')
  return getCandidateList;
}

const getPointsForFullTimers = async(getCandidateList, getJobData)=>{
  let toalPoints = 23;
  for(var i=0; i<getCandidateList.length; i++){
    let givePoints = 6; // get auto points for jobChangeReason, availableWorkDays, availableWorkHours, timeZone, hourlyWage, descProfessionalGoal
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
    getCandidateList[i].matchingPercentage = parseInt((givePoints/toalPoints)*100)
  }
  // console.log('complete')
  return getCandidateList;
}

const mailForAfterCandidateMatched = async(getJobData, empId, matchedCount)=>{
  try{
    let updateData = await Jobs.findByIdAndUpdate(getJobData._id, { $set: { matchesCandidateFlag: true, matchesCandidateCount: matchedCount }});
    // console.log(updateData);
    let empDetails = await Employer.findById(empId)
    let companyName = empDetails.companyName;
    let jobTitle = getJobData.title

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
      to: empDetails.email,
      subject: 'Remote Job Posting Confirmation - RemoteReq',
     html: '<div style="font-family: \'Open Sans\', sans-serif; padding: 15px;"><p>Hey <b>'+companyName+'</b>,</p><p>This email is to confirm a Candidated Matched for the position of <b>'+jobTitle+'</b> to <a target="_blank" href="www.remotereq.com">RemoteReq.com</a></p><p><b>What happens next?</b><br>Go for first payment & start recruitment.</p><p><a target="_blank" href="'+process.env.FRONTEND_BASE_URL+'employer/signin">Click here</a> to visit your account.</p><p>Be well,</p><p><img src="https://remotereq.s3.us-east-2.amazonaws.com/remotereqlogo.JPG"></p><p style="font-size:11px; margin-top: -15px;">Work from Anywhere. Change the World.</p><h5 style="font-weight:normal">e: <a href="javascript:void(0)" >remotereq@gmail.com</a><br> w: <a target="_blank" href="www.remotereq.com">www.remotereq.com</a></h5><ul style="list-style: none;padding-left: 0;"><li style="float: left;margin-right: 3px;"><a href="https://www.facebook.com/RemoteReq-1833060860134583" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/facebook-512.png" style="width: 100%;"/> </a></li><li style="float: left;margin-right: 3px;"><a href="https://www.linkedin.com/company/remotereq" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/linkedin-512.png"  style="width: 100%;"/></a></li><li style="float: left;margin-right: 3px;"><a href="" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/twitter-512.png" style="width: 100%;"/></a></li></ul></div>',
      
    };

    transporter.sendMail(mailOptions, async function(error, info){
    if (error) {
      console.log("error: Unable to send email.", error);
    } else {
      console.log('mail send for matches candidate list');
    }
  });
  } catch(err) {
      console.log(err);
  }
}

const jobsList = async(req, res)=>{
  try {
    let jobsListData = await Jobs.find();
    res.status(200).json(jobsListData);
    
  } catch(err) {
    res.status(500).json(err);
  }
}

// const createClientForGateway = async(req, res)=>{
//   gateway.customer.create({
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     company: req.body.company,
//     email: req.body.email,
//     phone: req.body.phone,
//     // fax: "614.555.5678",
//     // website: "www.example.com"
//   }).then(result =>{
//       result.customer.id;
//       res.status(200).json(result);
//   })
//   .catch(err =>{
//     res.status(500).json(err);
//   });
// }

const clientTokenForPayment = async(req, res)=>{
  gateway.clientToken.generate({
    // customerId: req.employerId
    customerId: req.body.clientId

  }, function (err, response) {
    if(err){
      res.status(500).json('payment token not generate for server issue')
    }else{
      res.status(200).json(response.clientToken);
    }
    
  });
}

const checkoutForAddjob = async(req, res)=>{
  gateway.transaction.sale({
    amount: req.body.amount,
    paymentMethodNonce: req.body.paymentMethodNonce,
    options: {
      submitForSettlement: true
    }
  }).then(function (result) {
    if (result.success) {
      console.log('Transaction ID: ' + result.transaction.id);
      res.status(200).json({
        transactionId : result.transaction.id
      });
    } else {
      console.error(result.message);
      res.status(400).json(result.message);
    }
  }).catch(function (err) {
    console.error(err);
    res.status(500).json(err);
  });
}
const checkoutAfterHired = async(req, res)=>{
  
  gateway.transaction.sale({
    amount: req.body.amount,
    paymentMethodNonce: req.body.paymentMethodNonce,
    options: {
      submitForSettlement: true
    }
  }).then(async function (result) {
    if (result.success) {
      console.log('Transaction ID: ' + result.transaction.id);
      let updateData = await Jobs.findByIdAndUpdate(req.body.jobId, { $set: {'transactionDetails.transactionIdAfterHired.transactionId': result.transaction.id, hiringPaymentStatus: true}});
    
      res.status(200).json({
        transactionId : result.transaction.id
      });
    } else {
      console.error(result.message);
      res.status(400).json(result.message);
    }
  }).catch(function (err) {
    console.error(err);
    res.status(500).json(err);
  });
}

module.exports = {
  addJob,
  jobsList,
  // createClientForGateway,
  clientTokenForPayment,
  checkoutForAddjob,
  checkoutAfterHired,
  // findPendingPayment
};