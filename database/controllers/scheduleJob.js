var nodemailer = require('nodemailer');
const moment = require('moment');
const Employer = require('../models/Employer');
const Job = require('../models/Job');
const User = require('../models/User');
const MatchedJobSeeker = require('../models/MatchedJobSeeker_master')

const mailToEmployerForCandidateMatch = async(req, res)=>{
  try {
    let jobList = await Job.find({ matchesCandidateFlag: false });
    
    for(var i=0; i<jobList.length; i++){
      let getCandidateList = await checkMatchesCandidateList(req, res, jobList[i]._id)
    }
    console.log("Cron checked matches candidate list")
    res.send('Cron checked matches candidate list')
  } catch(err) {
    res.status(500).json(err);
  }
  
}

const checkMatchesCandidateList = async(req, res, jobId)=>{
  try{
    
    let getJobData = await Job.findById(jobId).select("-__v");

    let getCandidateList= '';
    if(getJobData.availability == 'Remote'){

      getCandidateList = await User.aggregate([
        {
          $match: { $and: [
            { title: {'$regex':"^"+getJobData.title, '$options': 'i'}},
            { location: getJobData.location },
            { $or: [ { availability: 'Remote' }, { availability: 'Flexible' }]  },
            { causes: {'$regex':"^"+getJobData.cause, '$options': 'i'}},
            { jobType: getJobData.jobType },
            { isDeleteAccount: false }
          ]}
        },
        {
          $project: {
            title: 1,
            availability: 1,
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
            reasonForCause: 1,
            availableWorkHours: 1,
            timeZone: 1,
            hourlyWage: 1,
            salary: 1,
            projectDescription: 1,
            sampleProjectLink: 1,
            relavantCertificates: 1,
            // isWorkRemotely: 1,
            aboutMe: 1,
            totalExperience: 1,
            linkedInURL: 1,
            personalURL: 1,
            mobileNum: 1,
            howLongWorkingRemotely: 1,
            refferedBy: 1,
            profilePicUrl: 1,
            resumePath: 1,
            // address: 1,
            // pincode: 1,
            jobType: 1,
            dayssince: {
              $trunc: {
                $divide: [{ $subtract: [getJobData.soonestJoinDate, '$soonestJoinDate'] }, 1000 * 60 * 60 * 24]
              }
            }
          }
        }
      ])
      
      return matchingPercentageCalculation(getCandidateList, getJobData);
      
    }else if(getJobData.availability == 'On-site'){
      getCandidateList = await User.aggregate([
        {
          $match: { $and: [
            { title: {'$regex':"^"+getJobData.title, '$options': 'i'}},
            { location: getJobData.location },
            { $or: [ { availability: 'On-site' }, { availability: 'Flexible' }]  },
            { causes: {'$regex':"^"+getJobData.cause, '$options': 'i'}},
            { jobType: getJobData.jobType },
            { isDeleteAccount: false }
          ]}
        },
        {
          $project: {
            title: 1,
            availability: 1,
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
            reasonForCause: 1,
            availableWorkHours: 1,
            timeZone: 1,
            hourlyWage: 1,
            salary: 1,
            projectDescription: 1,
            sampleProjectLink: 1,
            relavantCertificates: 1,
            // isWorkRemotely: 1,
            aboutMe: 1,
            totalExperience: 1,
            linkedInURL: 1,
            personalURL: 1,
            mobileNum: 1,
            howLongWorkingRemotely: 1,
            refferedBy: 1,
            profilePicUrl: 1,
            resumePath: 1,
            // address: 1,
            // pincode: 1,
            jobType: 1,
            dayssince: {
              $trunc: {
                $divide: [{ $subtract: [getJobData.soonestJoinDate, '$soonestJoinDate'] }, 1000 * 60 * 60 * 24]
              }
            }
          }
        }
      ])
      return matchingPercentageCalculation(getCandidateList, getJobData);
    }else{
      getCandidateList = await User.aggregate([
        {
          $match: { $and: [
            { title: {'$regex':"^"+getJobData.title, '$options': 'i'}},
            { location: getJobData.location },
            { causes: {'$regex':"^"+getJobData.cause, '$options': 'i'}},
            { jobType: getJobData.jobType },
            { isDeleteAccount: false }
          ]}
        },
        {
          $project: {
            title: 1,
            availability: 1,
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
            reasonForCause: 1,
            availableWorkHours: 1,
            timeZone: 1,
            hourlyWage: 1,
            salary: 1,
            projectDescription: 1,
            sampleProjectLink: 1,
            relavantCertificates: 1,
            // isWorkRemotely: 1,
            aboutMe: 1,
            totalExperience: 1,
            linkedInURL: 1,
            personalURL: 1,
            mobileNum: 1,
            howLongWorkingRemotely: 1,
            refferedBy: 1,
            profilePicUrl: 1,
            resumePath: 1,
            // address: 1,
            // pincode: 1,
            jobType: 1,
            dayssince: {
              $trunc: {
                $divide: [{ $subtract: [getJobData.soonestJoinDate, '$soonestJoinDate'] }, 1000 * 60 * 60 * 24]
              }
            }
          }
        }
      ])
      return matchingPercentageCalculation(getCandidateList, getJobData);
    }

  } catch(err) {
      console.log(err);
  }
}

const matchingPercentageCalculation = async(getCandidateList, getJobData)=>{
  let getPointsCandidateList = '';

  if(getJobData.jobType == 'Part Time'){
    getPointsCandidateList = await getPointsForHalfTimers(getCandidateList, getJobData);
  }else{
    getPointsCandidateList = await getPointsForFullTimers(getCandidateList, getJobData);
  }
  
  getPointsCandidateList.sort((a, b) => b.matchingPercentage - a.matchingPercentage);
  let filteredList = getPointsCandidateList.filter(data => data.matchingPercentage >= getJobData.percentageMatch).slice(0, getJobData.numberOfCandidate)
  
  if(filteredList.length>0){
    await savedMatchedCandidateList(filteredList)
    await mailForAfterCandidateMatched(getJobData, getJobData.addBy, filteredList.length);
  }else{
    console.log('Candidates not matched right now of JobId: '+getJobData._id)
  }
  
  return filteredList;
}

const getPointsForHalfTimers = async(getCandidateList, getJobData)=>{
  let toalPoints = 23;
  const majorQuestionPoints = 85;
  const numberOfMinorQuestions = 15;
  const minorQuestionPoints = ( 15 / numberOfMinorQuestions )
  for(var i=0; i<getCandidateList.length; i++){
    let givePoints = (3*minorQuestionPoints); // get auto points for reasonForCause, salary, aboutMe
    //check education matching
    if(getJobData.requiredEducationLevel <= getCandidateList[i].highestEducationLevel){
      givePoints += minorQuestionPoints;
    }
    
    //check working hours matching
    // var candidateWT = getCandidateList[i].availableWorkHours.split('-');
    // var employerWT = getJobData.workHours.split('-');
    // if( (parseInt(candidateWT[0])>=parseInt(employerWT[0]) && parseInt(candidateWT[0])<=parseInt(employerWT[1])) || (parseInt(candidateWT[1]) >= parseInt(employerWT[0]) && parseInt(candidateWT[1]) <= parseInt(employerWT[1]))){
    //   givePoints += minorQuestionPoints;
    // }
    //check time zone matching
    if(getJobData.timeZone == getCandidateList[i].timeZone){
      givePoints += minorQuestionPoints;
    }
    //check hourly pay match
    if(getCandidateList[i].hourlyWage <= getJobData.hourlyWage){
      givePoints += minorQuestionPoints;
    }
    if(getCandidateList[i].projectDescription != ''){
      givePoints += minorQuestionPoints;
    }
    if(getCandidateList[i].sampleProjectLink != ''){
      givePoints += minorQuestionPoints;
    }
    if(getCandidateList[i].relavantCertificates != ''){
      givePoints += minorQuestionPoints;
    }
    //check experience
    if(getCandidateList[i].totalExperience>=getJobData.minExperience){
      givePoints += minorQuestionPoints;
    }
    //check atleast one key skill match or not
    if(getCandidateList[i].desireKeySkills.some((val) => getJobData.keySkills.indexOf(val) !== -1)){
      givePoints += minorQuestionPoints;
    }
    if(getCandidateList[i].dayssince <= 14 && !(getCandidateList[i].dayssince < 0)){
      givePoints += minorQuestionPoints;
    }
    getCandidateList[i].matchingPercentage = parseInt(givePoints) + majorQuestionPoints;
    getCandidateList[i].jobId = getJobData._id;
    getCandidateList[i].candidateId = (getCandidateList[i]._id).toString();
    delete getCandidateList[i]._id
  }
  // console.log('complete')
  return getCandidateList;
}

const getPointsForFullTimers = async(getCandidateList, getJobData)=>{
  let toalPoints = 23;
  const majorQuestionPoints = 85;
  const numberOfMinorQuestions = 15;
  const minorQuestionPoints = ( 15 / numberOfMinorQuestions )
  
  for(var i=0; i<getCandidateList.length; i++){
    let givePoints = (5*minorQuestionPoints); // get auto points for reasonForCause, availableWorkDays, timeZone, hourlyWage, aboutMe
    //check education matching
    if(getJobData.requiredEducationLevel <= getCandidateList[i].highestEducationLevel){
      givePoints += minorQuestionPoints;
    } 
    //check annual pay match
    if((getCandidateList[i].salary - 10000)<= getJobData.salary && (getCandidateList[i].salary + 10000) >= getJobData.salary){
      givePoints += minorQuestionPoints;
    }
    if(getCandidateList[i].projectDescription != ''){
      givePoints += minorQuestionPoints;
    }
    if(getCandidateList[i].sampleProjectLink != ''){
      givePoints += minorQuestionPoints;
    }
    if(getCandidateList[i].relavantCertificates != ''){
      givePoints += minorQuestionPoints;
    }
    
    //check experience
    if(getCandidateList[i].totalExperience>=getJobData.minExperience){
      givePoints += minorQuestionPoints;
    }
    // //check atleast one key skill match or not
    if(getCandidateList[i].desireKeySkills.some((val) => getJobData.keySkills.indexOf(val) !== -1)){
      givePoints += minorQuestionPoints;
    }
    // console.log(parseInt(getCandidateList[i].dayssince))
    if(getCandidateList[i].dayssince <= 14 && !(getCandidateList[i].dayssince < 0)){
      givePoints += minorQuestionPoints;
    }

    getCandidateList[i].matchingPercentage = parseInt(givePoints) + majorQuestionPoints;
    getCandidateList[i].jobId = getJobData._id;
    getCandidateList[i].candidateId = (getCandidateList[i]._id).toString();
    delete getCandidateList[i]._id
  }
  
  // console.log('complete')
  return getCandidateList;
}

const mailForAfterCandidateMatched = async(getJobData, empId, matchedCount)=>{
  try{
    let expiredDt = (process.env.HOST_TYPE=='live')? new Date(+new Date() + 21*24*60*60*1000) : new Date(+new Date() + 0.5*60*60*1000);
    let dateTime1 = moment(expiredDt).format('YYYY-MM-DD');
    let updateData = await Job.findByIdAndUpdate(getJobData._id, { $set: { 
      matchesCandidateFlag: true, 
      matchesCandidateCount: matchedCount,
      expireDate: expiredDt,
      seventhDayAfterExpireDate: (process.env.HOST_TYPE=='live')? new Date(+new Date() + 28*24*60*60*1000) : new Date(+new Date() + 1*60*60*1000)
    }});
    // console.log(updateData);
    let empDetails = await Employer.findById(empId)
    let companyName = empDetails.companyName;
    let jobTitle = getJobData.title

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
      to: empDetails.email,
      subject: 'Matched Candidate Notification - RemoteReq',
      // html: '<div style="font-family: \'Open Sans\', sans-serif; padding: 15px;"><p>Hey <b>'+companyName+'</b>,</p><p>This email is to confirm a Candidated Matched for the position of <b>'+jobTitle+'</b> to <a target="_blank" href="www.remotereq.com">RemoteReq.com</a></p><p><b>What happens next?</b><br>Go for first payment & start recruitment.</p><p><a target="_blank" href="'+process.env.FRONTEND_BASE_URL+'employer/signin">Click here</a> to visit your account.</p><p>Be well,</p><p><img src="https://remotereq.s3.us-east-2.amazonaws.com/remotereqlogo.JPG"></p><p style="font-size:11px; margin-top: -15px;">Work from Anywhere. Change the World.</p><h5 style="font-weight:normal">e: <a href="javascript:void(0)" >remotereq@gmail.com</a><br> w: <a target="_blank" href="www.remotereq.com">www.remotereq.com</a></h5><ul style="list-style: none;padding-left: 0;"><li style="float: left;margin-right: 3px;"><a href="https://www.facebook.com/RemoteReq-1833060860134583" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/facebook-512.png" style="width: 100%;"/> </a></li><li style="float: left;margin-right: 3px;"><a href="https://www.linkedin.com/company/remotereq" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/linkedin-512.png"  style="width: 100%;"/></a></li><li style="float: left;margin-right: 3px;"><a href="" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/twitter-512.png" style="width: 100%;"/></a></li></ul></div>',
      html: '<div style="font-family: \'Open Sans\', sans-serif; padding: 15px;"><p>Hey <b>'+companyName+'</b>,</p><p>Congratulations! You have <b>'+matchedCount+'</b> of matches for your job post <b>'+jobTitle+'</b> on <a target="_blank" href="www.remotereq.com">RemoteReq.com</a></p><p><b>What happens next?</b><br>You have 21 days to review your matches, interview candidates, and make an offer for your open position. The countdown starts now. Your job req will expire on '+dateTime1+'</p><p><a target="_blank" href="'+process.env.FRONTEND_BASE_URL+'employer/signin">Click here</a> to visit your account or to post another job req.</p><p>Be well,</p><p><img src="https://remotereq.s3.us-east-2.amazonaws.com/remotereqlogo.JPG"></p><p style="font-size:11px; margin-top: -15px;">Work from Anywhere. Change the World.</p><h5 style="font-weight:normal">e: <a href="javascript:void(0)" >remotereq@gmail.com</a><br> w: <a target="_blank" href="www.remotereq.com">www.remotereq.com</a></h5><ul style="list-style: none;padding-left: 0;"><li style="float: left;margin-right: 3px;"><a href="https://www.facebook.com/RemoteReq-1833060860134583" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/facebook-512.png" style="width: 100%;"/> </a></li><li style="float: left;margin-right: 3px;"><a href="https://www.linkedin.com/company/remotereq" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/linkedin-512.png"  style="width: 100%;"/></a></li><li style="float: left;margin-right: 3px;"><a href="" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/twitter-512.png" style="width: 100%;"/></a></li></ul>',
      
    };

    transporter.sendMail(mailOptions, async function(error, info){
    if (error) {
      console.log("error: Unable to send email.", error);
    } else {
      console.log('mail send for matches candidate list of jobId: '+getJobData._id);
    }
  });
  } catch(err) {
      console.log(err);
  }
}

const savedMatchedCandidateList = async(matchedCandidateList)=>{
  // console.log('matchedCandidateList',matchedCandidateList)
  MatchedJobSeeker.insertMany(matchedCandidateList).then(function(){ 
      console.log("Matched Job Seekers Data inserted by cron")  // Success 
  }).catch(function(error){ 
      console.log('Error in bulk insert matched job seekers',error)      // Failure 
  }); 
}

const mailForTwoDaysLeft = async(req, res)=>{
  var currentDate = new Date();
  // var currentDate = new Date(2020, 6, 31);
  // console.log(currentDate)
  // console.log(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()+2)
  // console.log('hfh', new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()+3))

  try{
    let getJobList = await Job.aggregate([
      {
        $match: { expireDate: { "$gte": new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2), "$lt": new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 3) } }
        
      },
      {
        $project: {
          addBy: 1,
          title: 1
        }
      }
    ])
    
    // res.send(getJobList)
    for(var i=0; i<getJobList.length; i++){
      await sendMailForTwoDaysReminder(getJobList[i].addBy, getJobList[i].title)
    }
    console.log('okkk')
    res.send('okkk')
  } catch(err) {
    console.log(err);
  }
}

const sendMailForTwoDaysReminder = async(empId, jobTitle)=>{
  let empDetails = await Employer.findById(empId)
  // console.log(empDetails.email)
  let fullName = empDetails.fullName.toUpperCase();
  let fullNameArr = fullName.split(" ");
  let firstName = fullNameArr[0];

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
    to: empDetails.email,
    subject: '48 hours left to review your matches! - RemoteReq',
    html: '<div style="font-family: \'Open Sans\', sans-serif; padding: 15px;"><p>Hey <b>'+firstName+'</b>,</p><p>You have 48 hours left to review your candidate matches for the position of <b>'+jobTitle+'</b> to <a target="_blank" href="www.remotereq.com">RemoteReq.com</a></p><p><b>What happens next?</b><br>Upon being notified of your candidate matches, you were given 21 days to review your matches, interview candidates, and make an offer for your open position. If you choose to hire one of the candidates supplied by RemoteReq you will owe a placement fee of <$900 for part-time roles, or $2,4000 for full-time roles>.</p><p><a target="_blank" href="'+process.env.FRONTEND_BASE_URL+'employer/signin">Click here</a> to visit your account or to post another job req.</p><p>Be well,</p><p><img src="https://remotereq.s3.us-east-2.amazonaws.com/remotereqlogo.JPG"></p><p style="font-size:11px; margin-top: -15px;">Work from Anywhere. Change the World.</p><h5 style="font-weight:normal">e: <a href="javascript:void(0)" >remotereq@gmail.com</a><br> w: <a target="_blank" href="www.remotereq.com">www.remotereq.com</a></h5><ul style="list-style: none;padding-left: 0;"><li style="float: left;margin-right: 3px;"><a href="https://www.facebook.com/RemoteReq-1833060860134583" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/facebook-512.png" style="width: 100%;"/> </a></li><li style="float: left;margin-right: 3px;"><a href="https://www.linkedin.com/company/remotereq" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/linkedin-512.png"  style="width: 100%;"/></a></li><li style="float: left;margin-right: 3px;"><a href="" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/twitter-512.png" style="width: 100%;"/></a></li></ul></div>',
    
  };

  transporter.sendMail(mailOptions, async function(error, info){
    if (error) {
      console.log("error: Unable to send email.", error);
    } else {
      console.log('mail send for 48 hours left')
    }
  });
}

//ask employer to hiring complete or not? (continue 7 days from expiration date)
const checkHiredOrNot = async(req, res)=>{
  let currentDate = new Date();
  // let currentDate = new Date(2020, 7, 13);
  // console.log(currentDate)
  try{
    let getJobList = await Job.aggregate([
      {
        $match: { $and: [
          { expireStatus: true},
          { hiredStatus: null},
          { seventhDayAfterExpireDate: { $gt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1) } }
        ]} 
      },
      {
        $project: {
          addBy: 1,
          title: 1
        }
      }
    ])
    
    // res.send(getJobList)
    // return;
    for(var i=0; i<getJobList.length; i++){
      await sendMailForHiring(getJobList[i].addBy, getJobList[i]._id, getJobList[i].title)
    }
    console.log('okkk')
    res.send('hiring checked')
  } catch(err) {
    console.log(err);
  }
}

const sendMailForHiring = async(empId, jobId, jobTitle)=>{
  let empDetails = await Employer.findById(empId)
  // console.log(empDetails.email)
  let fullName = empDetails.fullName.toUpperCase();
  let fullNameArr = fullName.split(" ");
  let firstName = fullNameArr[0];

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
    to: empDetails.email,
    subject: 'Thanks for recruiting with RemoteReq <Response Needed>',
    html: '<div style="font-family: \'Open Sans\', sans-serif; padding: 15px;"><p>Hey <b>'+firstName+'</b>,</p><p>Your time 21-day interview window has closed for the position of <b>'+jobTitle+'</b> on <a target="_blank" href="www.remotereq.com">RemoteReq.com</a></p><p><b>Did you make a hire for this position? <a target="_blank" href="'+process.env.FRONTEND_BASE_URL+'isHired?status=true&jobId='+jobId+'" style="color:#1f3961; text-decoration: none;border-bottom: 1px solid #000;">YES</a>  or <a target="_blank" href="'+process.env.FRONTEND_BASE_URL+'isHired?status=false&jobId='+jobId+'" style="color:#1f3961; text-decoration: none;border-bottom: 1px solid #000;">NO</a></b><br></p><p><b>Warning:</b> You have 7 days to respond to let us know the outcome of your search. Failure to respond to notify RemoteReq of the outcome of your search will be interpreted as confirmation of a hire, and you will be charged a placement fee of <$900 for a part-time role or $2,400 for a full-time role>. Please respond as soon as possible.</p><p><a target="_blank" href="'+process.env.FRONTEND_BASE_URL+'employer/signin">Click here</a> to visit your account or to post another job req.</p><p>Be well,</p><p><img src="https://remotereq.s3.us-east-2.amazonaws.com/remotereqlogo.JPG"></p><p style="font-size:11px; margin-top: -15px;">Work from Anywhere. Change the World.</p><h5 style="font-weight:normal">e: <a href="javascript:void(0)" >remotereq@gmail.com</a><br> w: <a target="_blank" href="www.remotereq.com">www.remotereq.com</a></h5><ul style="list-style: none;padding-left: 0;"><li style="float: left;margin-right: 3px;"><a href="https://www.facebook.com/RemoteReq-1833060860134583" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/facebook-512.png" style="width: 100%;"/> </a></li><li style="float: left;margin-right: 3px;"><a href="https://www.linkedin.com/company/remotereq" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/linkedin-512.png"  style="width: 100%;"/></a></li><li style="float: left;margin-right: 3px;"><a href="" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/twitter-512.png" style="width: 100%;"/></a></li></ul></div>',
    
  };

  transporter.sendMail(mailOptions, async function(error, info){
    if (error) {
      console.log("error: Unable to send email.", error);
    } else {
      console.log('mail send for check hiring')
    }
  });
}

// check employer answer for hiring complete or not
const isHired = async(req, res)=>{
  try{
    await Job.findByIdAndUpdate(req.query.jobId, { $set: { hiredStatus: req.query.status }});
    // res.status(200).json("Status Updated Successfully");
    res.status(200).json({
      message: "Updated Successfully",
      hiredStatus: req.query.status,
      jobId: req.query.jobId
    });
  } catch(err) {
      console.log(err);
  }
}

// check employer not response about hiring after 7 days later from expired date 
const autoUpdateHiringStatus = async(req, res)=>{
  let currentDate = new Date();
  
  try{
    let getJobList = await Job.updateMany(
      { 
        hiredStatus: null, 
        seventhDayAfterExpireDate: { $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) } ,
        seventhDayAfterExpireDate: { $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()+1 ) } ,
      },

      { $set: { hiredStatus: true } }
    )
    res.send('Auto update hired status')
  } catch(err) {
    console.log(err);
  }
}


//check all jobs which is expired today 
const checkExpiredJob = async(req, res)=>{
  let currentDate = new Date();
  // let currentDate = new Date(2020, 7, 13);
  // console.log(currentDate)
  try{
    let getJobList = await Job.updateMany(
      { 
        matchesCandidateFlag: true,
        expireDate: { "$gte": new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() ), "$lt": new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1) }
      },

      { $set: { expireStatus: true } }
    )
    
    res.send('update Expire Status')
  } catch(err) {
    console.log(err);
  }
}

module.exports = {
  mailToEmployerForCandidateMatch,
  mailForTwoDaysLeft,
  checkHiredOrNot,
  checkExpiredJob,
  isHired,
  autoUpdateHiringStatus
};