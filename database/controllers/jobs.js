const Jobs = require('../models/Job');
const Employer = require('../models/Employer');
var nodemailer = require('nodemailer');
const gateway = require('../../gateway/connection')
// console.log('gateway', gateway)

const addJob = async(req, res) => {
  
  const job = new Jobs({
    companyName: req.body.companyName,
    industryType: req.body.industryType,
    role: req.body.role,
    jobDetails: req.body.jobDetails,
    keySkills: req.body.keySkills,
    ctc: req.body.ctc,
    minExperience: req.body.minExperience,
    maxExperience: req.body.maxExperience,
    location: req.body.location,
    numberOfCandidate: req.body.numberOfCandidate,
    percentageMatch: req.body.percentageMatch,
    addBy: req.employerId,
  });

  //save user's details
  job.save()
  .then(doc => {
    // res.status(200).json(doc);
    sendMailAfterJobPost(req, res, req.employerId)
  })
  .catch(error => {
    console.log('ERROR 💥:', error)
    res.status(500).json(error);
  });
};

const sendMailAfterJobPost = async(req, res, empId)=>{
  let empDetails = await Employer.findById(empId)

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
    subject: 'RemoteReq: Job post on Remotereq',
    html: '<div style="font-family: \'Open Sans\', sans-serif; padding: 15px;"><p>Hey '+empDetails.fullName+',</p><p> Plese start interviewing our remote talent—immediately.</p><p>Be well,</p><p style="color:#1f3961";><b>RemoteReq</b> | Remote work with purpose.</p><h5 style="font-weight:normal">Visit us online, or follow us on social media.</br> <a target="_blank" href="www.remotereq.com">www.remotereq.com</a></h5><ul style="list-style: none;padding-left: 0;"><li style="float: left;margin-right: 3px;"><a href="https://www.facebook.com/RemoteReq-1833060860134583" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/facebook-512.png" style="width: 100%;"/> </a></li><li style="float: left;margin-right: 3px;"><a href="https://www.linkedin.com/company/remotereq" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/linkedin-512.png"  style="width: 100%;"/></a></li><li style="float: left;margin-right: 3px;"><a href="" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/twitter-512.png" style="width: 100%;"/></a></li></ul></div>',
    
  };

  transporter.sendMail(mailOptions, async function(error, info){
    if (error) {
      console.log("error: Unable to send email.", error);
    } else {
      console.log('mail send for matches candidate list');
      res.send('Job Post Successfully')
    }
  });
}

const jobsList = async(req, res)=>{
  try {
    let jobsListData = await Jobs.find();
    res.status(200).json(jobsListData);
    
  } catch(err) {
    res.status(500).json(err);
  }
}

const clientTokenForPayment = async(req, res)=>{
  gateway.clientToken.generate({
    // customerId: req.employerId
  }, function (err, response) {
    if(err){
      res.send('payment token not generate for server issue')
    }else{
      // console.log('hghjg')
      res.send(response.clientToken);
    }
    
  });
}

module.exports = {
  addJob,
  jobsList,
  clientTokenForPayment
};