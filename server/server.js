require('dotenv').config();
const express = require('express');
var cors = require('cors')

// middleware
const history = require('connect-history-api-fallback');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT;

// import route handlers
const signup = require('./api/auth/signUp.js');
const subscribe = require('./api/auth/subscribe');
const user = require('./api/auth/user');
const signin = require('./api/auth/signIn.js');
const jobs = require('./api/dashboard/jobs.js')
const employers = require('./api/Employer/employer')
const scheduleJob = require('./api/schedulejob/scheduleJob')
const demoRequestJob = require('./api/auth/demoRequest')

//CORS
app.use(cors())

// Use history to intecept client requests and forward to React Router history
app.use(history());

// express middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const {tokenValidityChecking, tokenValidityCheckingForEmp} = require('./authentication')
// require('./cron')
// routes
app.use('/api/signin', signin);
app.use('/api/signup', signup);
app.use('/api/subscribe', subscribe);
app.use('/api/requestDemo', demoRequestJob);
app.use('/api/scheduleJob', scheduleJob);
app.use('/api/user', tokenValidityChecking, user);
app.use('/api/jobs', tokenValidityCheckingForEmp, jobs);
app.use('/api/employers', tokenValidityCheckingForEmp, employers);

// app.get('/', (req, res) => {
//   res.status(200).send();
// });

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});