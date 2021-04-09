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
    subject: 'Demo Request - RemoteReq',
    html: 'Thank You'
    
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