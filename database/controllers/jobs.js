const Jobs = require('../models/Job.js');

function getFirstFiveJobs(callback) {
  Jobs.find({}, (err, data) => {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      const result = data.slice(0, 4);

      console.log('success! here are your first 5 jobs');
      callback(null, result);
    }
  });
}

module.exports = {
  getFirstFiveJobs,
};