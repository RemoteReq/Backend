const DemoRequest = require('../models/DemoRequest');

const addDemoRequest = async(req, res) => {
  
  const demoRequest = new DemoRequest({
    
    emailId: req.body.emailId,
    name: req.body.name?req.body.name:'',
    companyName: req.body.companyName?req.body.companyName:'',
    position: req.body.position?req.body.position:'',
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

const getDemoReqeusts = async(req, res)=>{
  try {
    let getData = await DemoRequest.find().select(" -__v");
    res.status(200).json(getData);
    
  } catch(err) {
    res.status(500).json(err);
  }
}

module.exports = {
  addDemoRequest,
  getDemoReqeusts
};