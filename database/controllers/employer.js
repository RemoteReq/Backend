var nodemailer = require('nodemailer');
const Employer = require('../models/Employer');
const Job = require('../models/Job');
const User = require('../models/User');
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
        // console.log(newCustomerOfPaymentGateway)
        // res.send(newCustomerOfPaymentGateway.customer.id);
        // return;


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
          // let filterDoc = {
          //   username: doc.username,
          //   email: doc.email,
          //   companyName: doc.companyName,
          //   logo: doc.logo,
          //   location: doc.location
          // }
          // res.status(200).json(filterDoc);
          // res.status(200).json('Signed up successfully done');
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
          user: 'notasom1@gmail.com',
          pass: 'notagoodpassword1'
      }
  });

  var mailOptions = {
    from: '"support@remotereq.com" <notasom1@gmail.com>',
    to: req.body.email,
    subject: 'Employer Account Confirmation - RemoteReq',
    // html: '<p>Hey '+doc.fullName+',</p><p>This email is to confirm an employer account for '+doc.companyName+' has been registered on RemoteReq.com. If this email was received in error, then unsubscribe <a target="_blank"  href="http://18.217.254.98/unsubscribeEmployer?id='+doc._id+'">here</a>.</p><p><a target="_blank" href="http://18.217.254.98/employerEmailVerify?id='+doc._id+'">Click here</a> to add new job req to your profile, or to start interviewing our remote talent—immediately.</p><p>Be well,</><p><b>RemoteReq</b> | Remote work with purpose.</><h5 style="font-weight:normal">Visit us online, or follow us on social media. </br> <a target="_blank" href="www.remotereq.com">www.remotereq.com</a></h5>',
    html: '<div style="font-family: \'Open Sans\', sans-serif; padding: 15px;"><p>Hey <b>'+companyName+'</b>,</p><p>This email is to confirm an employer account for <b>'+companyName+'</b> has been registered on <a target="_blank" href="www.remotereq.com">RemoteReq.com</a>. If this email was received in error, then unsubscribe <a target="_blank" href="http://18.217.254.98/unsubscribe?emailId='+doc.email+'" style="color:#1f3961; text-decoration: none;border-bottom: 1px solid #000;">here</a></p><p><a target="_blank" href="http://18.217.254.98/employerEmailVerify?id='+doc._id+'" style="color:#1f3961; text-decoration: none;border-bottom: 1px solid #000;">Click here</a> to add new job req to your profile, or to start interviewing our remote talent—immediately.</p><p>Be well,</p><p style="color:#1f3961";><b>RemoteReq</b></p><p style="font-size:11px; margin-top: -12px;">Work from Anywhere. Change the World.</p><h5 style="font-weight:normal">e: <a href="javascript:void(0)" >remotereq@gmail.com</a><br> w: <a target="_blank" href="www.remotereq.com">www.remotereq.com</a></h5><ul style="list-style: none;padding-left: 0;"><li style="float: left;margin-right: 3px;"><a href="https://www.facebook.com/RemoteReq-1833060860134583" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/facebook-512.png" style="width: 100%;"/> </a></li><li style="float: left;margin-right: 3px;"><a href="https://www.linkedin.com/company/remotereq" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/linkedin-512.png"  style="width: 100%;"/></a></li><li style="float: left;margin-right: 3px;"><a href="" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/twitter-512.png" style="width: 100%;"/></a></li></ul></div>',
    
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
  try{
    
    let getJobData = await Job.findById(req.params.jobId).select("-__v -addBy");

    // console.log(getJobData)

    let getCandidateList = await User.aggregate([
      {
        $match: {$and: [
          { industryType: getJobData.industryType }, 
          { desireCTC : { $lte: getJobData.ctc } },
          { $and: [ { totalExperience: { $gte: getJobData.minExperience } }, { totalExperience : { $lte: getJobData.maxExperience } } ] },
          {desireLocation: {'$regex':"^"+getJobData.location, '$options': 'i'}},
          {desireKeySkills : { $in: getJobData.keySkills}},
        ]}
      },
      {
        $addFields: { requireKeySkills: getJobData.keySkills }
      },
      {
        $addFields: { commonToBoth: { $setIntersection: [ "$requireKeySkills", "$desireKeySkills" ] } }
      },
      {
        $project: {
          keySkills:1,
          education: 1,
          fullName: 1,
          email: 1,
          fluentInEnglish: 1,
          eligibleToWorkInUS: 1,
          linkedInURL: 1,
          githubURL: 1,
          personalURL: 1,
          profilePicUrl: 1,
          mobileNum: 1,
          gender: 1,
          dob: 1,
          address: 1,
          pincode: 1,
          aboutMe: 1,
          refferedBy: 1,
          industryType: 1,
          jobRole: 1,
          currentCTC: 1,
          totalExperience: 1,
          desireIndustryType: 1,
          desireJobRole: 1,
          desireCTC: 1,
          desireLocation:1,
          desireKeySkills:1,
          MatchPercentage: {$multiply:[{$divide:[{$size: "$commonToBoth" },{$size: "$requireKeySkills" } ]},100]} ,
        }
      },
      { $sort : { MatchPercentage : -1 } },
      { $limit : getJobData.numberOfCandidate }
    ])
    
    res.status(200).json(getCandidateList);
  } catch(err) {
      console.log(err);
  }
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