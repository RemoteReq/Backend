require('dotenv').config();
var cron = require('node-cron');
var unirest = require('unirest');
console.log(process.env.HOST_TYPE)
let API_URL = (process.env.HOST_TYPE == 'local')? 'http://localhost:3030/' : (process.env.HOST_TYPE == 'dev')? 'http://3.21.186.204:3030/' : 'live api URL';
console.log(API_URL)

//find out all of the jobs which was expired(21 days period over) - everday at 12:01 AM
cron.schedule('15 18 * * *', () => {
    console.log('find out all of the jobs which was expired(21 days period over) - everday at 12:01 AM');
    unirest
      .post(API_URL+'api/scheduleJob/checkExpiredJob')
      .headers({'Content-Type': 'application/json'})
      .send({ 
          
      })
      .then(async(response) => {
          console.log(response.body)
      })
      .catch(err => {
          console.log(err)
      })
});

// After expired job sends mail for hiring complete or not (7 days continue until employer's answerd) - At 1:00 AM
cron.schedule('30 18 * * *', () => {
    console.log('After expired job sends mail for hiring complete or not (7 days continue until employer\'s answerd) - At 1:00 AM');
    unirest
      .post(API_URL+'api/scheduleJob/checkHiredOrNot')
      .headers({'Content-Type': 'application/json'})
      .send({ 
          
      })
      .then(async(response) => {
          console.log(response.body)
      })
      .catch(err => {
          console.log(err)
      })
});

// Auto charged for hiring if employer not responsed after 7 days - At 12:40 AM
cron.schedule('45 18 * * *', () => {
    console.log('Auto charged for hiring if employer not responsed after 7 days - At 12:40 AM');
    unirest
      .post(API_URL+'api/scheduleJob/employerNotRespForHiring')
      .headers({'Content-Type': 'application/json'})
      .send({ 
          
      })
      .then(async(response) => {
          console.log(response.body)
      })
      .catch(err => {
          console.log(err)
      })
});

// sends mail for 48 hours reminder - at 12:20 AM
cron.schedule('20 18 * * *', () => {
    console.log('sends mail for 48 hours reminder - at 12:20 AM');
    unirest
      .post(API_URL+'api/scheduleJob/mailForTwoDaysLeft')
      .headers({'Content-Type': 'application/json'})
      .send({ 
          
      })
      .then(async(response) => {
          console.log(response.body)
      })
      .catch(err => {
          console.log(err)
      })
});