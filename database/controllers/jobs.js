const Jobs = require('../models/Job');
const Employer = require('../models/Employer');
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
      'transactionDetails.transactionIdForAddJob.transactionId': req.body.transactionIdForAddJob,
      // 'transactionDetails.transactionIdAfterHired.transactionId': '',
    });
  
    //save user's details
    job.save()
    .then(doc => {
      // res.status(200).json(doc);
      sendMailAfterJobPost(req, res, req.employerId, req.body.title)
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
    // html: '<div style="font-family: \'Open Sans\', sans-serif; padding: 15px;"><p>Hey '+empDetails.fullName+',</p><p> Plese start interviewing our remote talent—immediately.</p><p>Be well,</p><p style="color:#1f3961";><b>RemoteReq</b> | Remote work with purpose.</p><h5 style="font-weight:normal">Visit us online, or follow us on social media.</br> <a target="_blank" href="www.remotereq.com">www.remotereq.com</a></h5><ul style="list-style: none;padding-left: 0;"><li style="float: left;margin-right: 3px;"><a href="https://www.facebook.com/RemoteReq-1833060860134583" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/facebook-512.png" style="width: 100%;"/> </a></li><li style="float: left;margin-right: 3px;"><a href="https://www.linkedin.com/company/remotereq" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/linkedin-512.png"  style="width: 100%;"/></a></li><li style="float: left;margin-right: 3px;"><a href="" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/twitter-512.png" style="width: 100%;"/></a></li></ul></div>',
    html: '<div style="font-family: \'Open Sans\', sans-serif; padding: 15px;"><p>Hey <b>'+companyName+'</b>,</p><p>This email is to confirm a remote job has been posted for the position of <b>'+jobTitle+'</b> to <a target="_blank" href="www.remotereq.com">RemoteReq.com</a></p><p><b>What happens next?</b><br>You will receive an email when your matches are ready for review. Upon being notified, you will have 21 days to review your matches, interview candidates, and make an offer for your opening. Be on the lookout for more details, coming soon.</p><p><a target="_blank" href="http://18.217.254.98/employer/signin">Click here</a> to visit your account or to post another job req.</p><p>Be well,</p><p style="color:#1f3961";><b>RemoteReq</b></p><p style="font-size:11px; margin-top: -8px;">Work from Anywhere. Change the World.</p><h5 style="font-weight:normal">e: <a href="javascript:void(0)" >remotereq@gmail.com</a><br> w: <a target="_blank" href="www.remotereq.com">www.remotereq.com</a></h5><ul style="list-style: none;padding-left: 0;"><li style="float: left;margin-right: 3px;"><a href="https://www.facebook.com/RemoteReq-1833060860134583" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/facebook-512.png" style="width: 100%;"/> </a></li><li style="float: left;margin-right: 3px;"><a href="https://www.linkedin.com/company/remotereq" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/linkedin-512.png"  style="width: 100%;"/></a></li><li style="float: left;margin-right: 3px;"><a href="" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/twitter-512.png" style="width: 100%;"/></a></li></ul></div>',
    
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