const DemoRequest = require('../models/DemoRequest');

const addDemoRequest = async(req, res) => {
  
  const demoRequest = new DemoRequest({
    
    emailId: req.body.emailId,
    name: req.body.name?req.body.name:'',
    companyName: req.body.companyName?req.body.companyName:'',
    phoneNumber: req.body.phoneNumber?req.body.phoneNumber:'',
  });

  
  demoRequest.save()
  .then(doc => {
    res.status(200).json(doc);
    // res.status(200).json('Your request is sucessfully accepted');
  })
  .catch(error => {
    console.log('ERROR 💥:', error)
    res.status(500).json(error);
  });
};


module.exports = {
  addDemoRequest,
};