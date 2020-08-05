var nodemailer = require('nodemailer');
const Employer = require('../models/Employer');
const Job = require('../models/Job');
const User = require('../models/User');


// const mailToEmployerForCandidateMatch = async(req, res)=>{
//   try {
//     let jobList = await Job.find({ mailForCandidateMatch: false });
    
//     for(var i=0; i<jobList.length; i++){
//       let getCandidateList = await checkMatchesCandidateList(req, res, jobList[i]._id)
//       // console.log(getCandidateList.length)
//       if(getCandidateList.length > 0){
//         await sendMailForFindCandidate(req, res, jobList[i].addBy, jobList[i]._id)
//         // await updateCandidateMatchStatus(req, res, jobList[i]._id)
//       }else{
//         console.log('no')
//       }
//     }
//     console.log("okk")
//     res.send('okk')
//   } catch(err) {
//     res.status(500).json(err);
//   }
  
// }

// const checkMatchesCandidateList = async(req, res, jobId)=>{
//   // console.log(jobId)
//   try{
    
//     let getJobData = await Job.findById(jobId).select("-__v -addBy");

//     let getCandidateList = await User.aggregate([
//       {
//         $match: {$and: [
//           { industryType: getJobData.industryType }, 
//           { desireCTC : { $lte: getJobData.ctc } },
//           { $and: [ { totalExperience: { $gte: getJobData.minExperience } }, { totalExperience : { $lte: getJobData.maxExperience } } ] },
//           {desireLocation: {'$regex':"^"+getJobData.location, '$options': 'i'}},
//           {desireKeySkills : { $in: getJobData.keySkills}},
//         ]}
//       },
//       {
//         $addFields: { requireKeySkills: getJobData.keySkills }
//       },
//       {
//         $addFields: { commonToBoth: { $setIntersection: [ "$requireKeySkills", "$desireKeySkills" ] } }
//       },
//       {
//         $project: {
//           keySkills:1,
//           education: 1,
//           fullName: 1,
//           email: 1,
//           fluentInEnglish: 1,
//           eligibleToWorkInUS: 1,
//           linkedInURL: 1,
//           githubURL: 1,
//           personalURL: 1,
//           profilePicUrl: 1,
//           mobileNum: 1,
//           gender: 1,
//           dob: 1,
//           address: 1,
//           pincode: 1,
//           aboutMe: 1,
//           refferedBy: 1,
//           industryType: 1,
//           jobRole: 1,
//           currentCTC: 1,
//           totalExperience: 1,
//           desireIndustryType: 1,
//           desireJobRole: 1,
//           desireCTC: 1,
//           desireLocation:1,
//           desireKeySkills:1,
//           MatchPercentage: {$multiply:[{$divide:[{$size: "$commonToBoth" },{$size: "$requireKeySkills" } ]},100]} ,
//         }
//       }
//     ])
    
//     // res.status(200).json(getCandidateList);
//     return getCandidateList
//   } catch(err) {
//       console.log(err);
//   }
// }

// const sendMailForFindCandidate = async(req, res, empId, jobId)=>{
//   let empDetails = await Employer.findById(empId)
//   // console.log(empDetails.email)

//   var transporter = nodemailer.createTransport({
//       // host: 'mail.lcn.com',
//       host: 'smtp.gmail.com',
//       port: 587,
//       secure: false,
//       // service: 'gmail',
//       auth: {
//           user: 'notasom1@gmail.com',
//           pass: 'notagoodpassword1'
//       }
//   });

//   var mailOptions = {
//     from: '"support@remotereq.com" <notasom1@gmail.com>',
//     to: empDetails.email,
//     subject: 'RemoteReq: Find Matched Candidates',
//     html: '<div style="font-family: \'Open Sans\', sans-serif; padding: 15px;"><p>Hey '+empDetails.fullName+',</p><p> Plese start interviewing our remote talent—immediately.</p><p>Be well,</p><p style="color:#1f3961";><b>RemoteReq</b> | Remote work with purpose.</p><h5 style="font-weight:normal">Visit us online, or follow us on social media.</br> <a target="_blank" href="www.remotereq.com">www.remotereq.com</a></h5><ul style="list-style: none;padding-left: 0;"><li style="float: left;margin-right: 3px;"><a href="https://www.facebook.com/RemoteReq-1833060860134583" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/facebook-512.png" style="width: 100%;"/> </a></li><li style="float: left;margin-right: 3px;"><a href="https://www.linkedin.com/company/remotereq" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/linkedin-512.png"  style="width: 100%;"/></a></li><li style="float: left;margin-right: 3px;"><a href="" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/twitter-512.png" style="width: 100%;"/></a></li></ul></div>',
    
//   };

//   transporter.sendMail(mailOptions, async function(error, info){
//     if (error) {
//       console.log("error: Unable to send email.", error);
//     } else {
//       console.log('mail send for matches candidate list')
//       await updateCandidateMatchStatus(req, res, jobId)
//     }
//   });
// }

// const updateCandidateMatchStatus = async(req, res, jobId)=>{
  
//   try{
//     let updateData = await Job.findByIdAndUpdate(jobId, { $set: {mailForCandidateMatch: true}});
    
//     console.log('mailForCandidateMatch field update for jobId: '+jobId)
//   } catch(err) {
//       console.log(err);
//       // res.status(500).json(err);
//   }
// }

//reminder 48 hrs left API
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
          addBy: 1
        }
      }
    ])
    
    // res.send(getJobList)
    for(var i=0; i<getJobList.length; i++){
      await sendMailForTwoDaysReminder(getJobList[i].addBy)
    }
    console.log('okkk')
    res.send('okkk')
  } catch(err) {
    console.log(err);
  }
}

const sendMailForTwoDaysReminder = async(empId)=>{
  let empDetails = await Employer.findById(empId)
  // console.log(empDetails.email)
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
    to: empDetails.email,
    subject: 'RemoteReq: 48 hours left',
    html: '<div style="font-family: \'Open Sans\', sans-serif; padding: 15px;"><p>Hey '+empDetails.fullName+',</p><p>Only 48 hours left. Plese complete your interviewing.</p><p>Be well,</p><p style="color:#1f3961";><b>RemoteReq</b> | Remote work with purpose.</p><h5 style="font-weight:normal">Visit us online, or follow us on social media.</br> <a target="_blank" href="www.remotereq.com">www.remotereq.com</a></h5><ul style="list-style: none;padding-left: 0;"><li style="float: left;margin-right: 3px;"><a href="https://www.facebook.com/RemoteReq-1833060860134583" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/facebook-512.png" style="width: 100%;"/> </a></li><li style="float: left;margin-right: 3px;"><a href="https://www.linkedin.com/company/remotereq" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/linkedin-512.png"  style="width: 100%;"/></a></li><li style="float: left;margin-right: 3px;"><a href="" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/twitter-512.png" style="width: 100%;"/></a></li></ul></div>',
    
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
  // let currentDate = new Date(2020, 7, 9);
  console.log(currentDate)
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
          addBy: 1
        }
      }
    ])
    
    // res.send(getJobList)
    // return;
    for(var i=0; i<getJobList.length; i++){
      await sendMailForHiring(getJobList[i].addBy, getJobList[i]._id)
    }
    console.log('okkk')
    res.send('hiring checked')
  } catch(err) {
    console.log(err);
  }
}

const sendMailForHiring = async(empId, jobId)=>{
  let empDetails = await Employer.findById(empId)
  // console.log(empDetails.email)
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
    to: empDetails.email,
    subject: 'RemoteReq: Did you make a hire?',
    html: '<div style="font-family: \'Open Sans\', sans-serif; padding: 15px;"><p>Hey '+empDetails.fullName+',</p><p>Time is up! Did you make a hire? <a target="_blank" href="http://18.217.254.98/isHired?status=true&jobId='+jobId+'" style="color:#1f3961; text-decoration: none;border-bottom: 1px solid #000;">YES</a>  or <a target="_blank" href="http://18.217.254.98/isHired?status=false&jobId='+jobId+'" style="color:#1f3961; text-decoration: none;border-bottom: 1px solid #000;">No</a></p><p>Be well,</p><p style="color:#1f3961";><b>RemoteReq</b> | Remote work with purpose.</p><h5 style="font-weight:normal">Visit us online, or follow us on social media.</br> <a target="_blank" href="www.remotereq.com">www.remotereq.com</a></h5><ul style="list-style: none;padding-left: 0;"><li style="float: left;margin-right: 3px;"><a href="https://www.facebook.com/RemoteReq-1833060860134583" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/facebook-512.png" style="width: 100%;"/> </a></li><li style="float: left;margin-right: 3px;"><a href="https://www.linkedin.com/company/remotereq" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/linkedin-512.png"  style="width: 100%;"/></a></li><li style="float: left;margin-right: 3px;"><a href="" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/twitter-512.png" style="width: 100%;"/></a></li></ul></div>',
    
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
  // let currentDate = new Date(2020, 7, 9);
  console.log(currentDate)
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
  // let currentDate = new Date(2020, 7, 7);
  console.log(currentDate)
  try{
    let getJobList = await Job.updateMany(
      { 
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
  // mailToEmployerForCandidateMatch,
  mailForTwoDaysLeft,
  checkHiredOrNot,
  checkExpiredJob,
  isHired,
  autoUpdateHiringStatus
};