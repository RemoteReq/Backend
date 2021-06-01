const Cause = require('../models/Cause.js');
const causes = require('../causes.js');

const addCause = async (req, res) => {

  const existingCause = await Cause.findOne({
    value: req.body.cause,
  });

  if (!existingCause || existingCause === null){
    const cause = new Cause({
      value: req.body.cause,
      label: req.body.cause,
    });
    
    cause.save();
    res.status(200).send('cause added!');
  } else {
 
    res.status(200).send('cause already exists!');
  }
}

const getCauses = async (req, res) => {

  const causes = await Cause.find({}).select("-_id -__v");

  res.status(200).send(causes);
}

const removeCause = async(req, res) => {
  
  const targetCause = await Cause.findOne({
    value: req.body.cause,
  }).remove();

  res.status(200).send('cause removed');
}

// const insertCurrentCauses = () => {
  
//   Cause.insertMany(causes);

//   console.log('finished')
// }

// insertCurrentCauses();

module.exports =
{
  addCause,
  getCauses,
  removeCause,
};