const Subscriber = require('../models/Subscriber');

const addSubscriber = async(req, res) => {
  
  const subscriber = new Subscriber({
    
    emailId: req.body.emailId,
    name: req.body.name?req.body.name:'',
    companyName: req.body.companyName?req.body.companyName:'',
    phoneNumber: req.body.phoneNumber?req.body.phoneNumber:'',
  });

  
  subscriber.save()
  .then(doc => {
    // res.status(200).json(doc);
    res.status(200).json('Your request is sucessfully accepted');
  })
  .catch(error => {
    console.log('ERROR 💥:', error)
    res.status(500).json(error);
  });
};

const subscribersList = async(req, res)=>{
  try {
    let subscribersListData = await Subscriber.find();
    res.status(200).json(subscribersListData);
    
  } catch(err) {
    res.status(500).json(err);
  }
}

const unsubscribe = async(req, res)=>{
  try {
    let deleteItem = await Subscriber.deleteMany({ emailId: req.query.emailId });
    res.status(200).json('Successfully unsubscribed');
    
  } catch(err) {
    res.status(500).json(err);
  }
}

module.exports = {
  addSubscriber,
  subscribersList,
  unsubscribe
};