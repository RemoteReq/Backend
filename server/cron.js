require('dotenv').config();
var cron = require('node-cron');
var unirest = require('unirest');
let API_URL = (process.env.HOST_TYPE == 'local')? 'http://localhost:3030/' : (process.env.HOST_TYPE == 'dev')? 'http://3.21.186.204:3030/' : 'http://18.191.219.131:3030/';

//find out all of the jobs which was expired(21 days period over) - everday at 12:01 AM
// cron.schedule('1 0 * * *', () => {
//     console.log('find out all of the jobs which was expired(21 days period over) - everday at 12:01 AM');
//     unirest
//       .post(API_URL+'api/scheduleJob/checkExpiredJob')
//       .headers({'Content-Type': 'application/json'})
//       .send({ 
          
//       })
//       .then(async(response) => {
//           console.log(response.body)
//       })
//       .catch(err => {
//           console.log(err)
//       })
// });

// After expired job sends mail for hiring complete or not (7 days continue until employer's answerd) - At 1:00 AM
// cron.schedule('0 1 * * *', () => {
//     console.log('After expired job sends mail for hiring complete or not (7 days continue until employer\'s answerd) - At 1:00 AM');
//     unirest
//       .post(API_URL+'api/scheduleJob/checkHiredOrNot')
//       .headers({'Content-Type': 'application/json'})
//       .send({ 
          
//       })
//       .then(async(response) => {
//           console.log(response.body)
//       })
//       .catch(err => {
//           console.log(err)
//       })
// });

// Auto charged for hiring if employer not responsed after 7 days - At 12:40 AM
// cron.schedule('40 0 * * *', () => {
//     console.log('Auto charged for hiring if employer not responsed after 7 days - At 12:40 AM');
//     unirest
//       .post(API_URL+'api/scheduleJob/employerNotRespForHiring')
//       .headers({'Content-Type': 'application/json'})
//       .send({ 
          
//       })
//       .then(async(response) => {
//           console.log(response.body)
//       })
//       .catch(err => {
//           console.log(err)
//       })
// });

// sends mail for 48 hours reminder - at 12:20 AM
// cron.schedule('20 0 * * *', () => {
//     console.log('sends mail for 48 hours reminder - at 12:20 AM');
//     unirest
//       .post(API_URL+'api/scheduleJob/mailForTwoDaysLeft')
//       .headers({'Content-Type': 'application/json'})
//       .send({ 
          
//       })
//       .then(async(response) => {
//           console.log(response.body)
//       })
//       .catch(err => {
//           console.log(err)
//       })
// });

// Cron run every 8 hours for check matching candidate
// cron.schedule('0 */8 * * *', () => {
//     console.log('Cron run every 8 hours for check matching candidate');
//     unirest
//       .post(API_URL+'api/scheduleJob/mailToEmployerForCandidateMatch')
//       .headers({'Content-Type': 'application/json'})
//       .send({ 
          
//       })
//       .then(async(response) => {
//           console.log(response.body)
//       })
//       .catch(err => {
//           console.log(err)
//       })
// });



// for Testing Purpose

cron.schedule('*/30 * * * *', () => { // job expired check every 30 minutes 
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

cron.schedule('*/10 * * * *', () => { // check hiring or not every 10 minutes
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

cron.schedule('*/5 * * * *', () => { // check employer not responde in hiring status for every 5 minutes
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

cron.schedule('*/3 * * * *', () => { // reminder between 10-5 mints left (check every 3 mints) 
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


cron.schedule('*/8 * * * *', () => { //check matched candidates list every 8 minutes
    
    unirest
      .post(API_URL+'api/scheduleJob/mailToEmployerForCandidateMatch')
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
