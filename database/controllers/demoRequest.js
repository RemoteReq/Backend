const DemoRequest = require('../models/DemoRequest');
var nodemailer = require('nodemailer');

const addDemoRequest = async(req, res) => {
  
  const demoRequest = new DemoRequest({
    
    emailId: req.body.emailId,
    name: req.body.name?req.body.name:'',
    companyName: req.body.companyName?req.body.companyName:'',
    position: req.body.position?req.body.position:'',
  });

  
  demoRequest.save()
  .then(async(doc) => {
    await sendMailOfDemoRequest(req, res);
    res.status(200).json(doc);
    // res.status(200).json('Your request is sucessfully accepted');
  })
  .catch(error => {
    console.log('ERROR 💥:', error)
    res.status(500).json(error);
  });
};

const getDemoReqeusts = async(req, res)=>{
  try {
    let getData = await DemoRequest.find().select(" -__v");
    res.status(200).json(getData);
    
  } catch(err) {
    res.status(500).json(err);
  }
}

const sendMailOfDemoRequest = async(req, res)=>{

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
    to: req.body.emailId,
    subject: 'Employer Demo Request - RemoteReq',
    html: '<div style="font-family: \'Open Sans\', sans-serif; padding: 15px;"><p>Hey <b>'+req.body.companyName+'</b>,</p><p>Thank you for your interest in RemoteReq. Helping you find the talent you need, to grow your impact is what we do. We will be in touch within the next 48 hours to schedule your employer demo session.</p><p>Talk soon,</p><p><img src="https://remotereq.s3.us-east-2.amazonaws.com/remotereqlogo.JPG"></p><p style="font-size:11px; margin-top: -15px;">Work from Anywhere. Change the World.</p><h5 style="font-weight:normal">e: <a href="javascript:void(0)" >remotereq@gmail.com</a><br> w: <a target="_blank" href="www.remotereq.com">www.remotereq.com</a></h5><ul style="list-style: none;padding-left: 0;"><li style="float: left;margin-right: 3px;"><a href="https://www.facebook.com/RemoteReq-1833060860134583" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/facebook-512.png" style="width: 100%;"/> </a></li><li style="float: left;margin-right: 3px;"><a href="https://www.linkedin.com/company/remotereq" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/linkedin-512.png"  style="width: 100%;"/></a></li><li style="float: left;margin-right: 3px;"><a href="" target="_blank" style="width: 25px; height: 25px; display: inline-block;"><img src="https://cdn4.iconfinder.com/data/icons/miu-flat-social/60/twitter-512.png" style="width: 100%;"/></a></li></ul></div>'
    
  };

  transporter.sendMail(mailOptions, async function(error, info){
    if (error) {
      console.log("error: Unable to send email.", error);
    } else {
      console.log('mail send for demo request');
    }
  });

}

module.exports = {
  addDemoRequest,
  getDemoReqeusts
};