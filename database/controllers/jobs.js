const Jobs = require('../models/Job');

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
    location: req.body.location
  });

  //save user's details
  job.save()
  .then(doc => {
    // console.log(doc);
    res.status(200).json(doc);
  })
  .catch(error => {
    console.log('ERROR 💥:', error)
    res.status(500).json(error);
  });
};

const jobsList = async(req, res)=>{
  try {
    let jobsListData = await Jobs.find();
    res.status(200).json(jobsListData);
    
  } catch(err) {
    res.status(500).json(err);
  }
}

module.exports = {
  addJob,
  jobsList
};