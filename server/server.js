require('dotenv').config();
const express = require('express');
const cors = require('cors');

// middleware
const bodyParser = require('body-parser');
const passport = require('passport');
require('../gateway/passportSetup');

const app = express();
const PORT = process.env.PORT;

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

//CORS
app.use(cors(corsOpts));

// import route handlers
const signup = require('./api/auth/signUp.js');
const subscribe = require('./api/auth/subscribe');
const global = require('./api/auth/global');
const socialLogin = require('./api/auth/socialLogin');
const user = require('./api/auth/user');
const signin = require('./api/auth/signIn.js');
const jobs = require('./api/dashboard/jobs.js');
const employers = require('./api/Employer/employer');
const scheduleJob = require('./api/schedulejob/scheduleJob');
const demoRequestJob = require('./api/auth/demoRequest');
const admin = require('./api/admin/admin.js');

// express middleware
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
const {tokenValidityChecking, tokenValidityCheckingForEmp} = require('./authentication');
app.use(require('express-session')({
  secret: process.env.GOOGLE_SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// require('./cron')
// routes
app.use('/', socialLogin);
app.use('/api/signin', signin);
app.use('/api/signup', signup);
app.use('/api/subscribe', subscribe);
app.use('/api/global', global);
app.use('/api/requestDemo', demoRequestJob);
app.use('/api/scheduleJob', scheduleJob);
app.use('/api/user', tokenValidityChecking, user);
app.use('/api/jobs', tokenValidityCheckingForEmp, jobs);
app.use('/api/employers', tokenValidityCheckingForEmp, employers);
app.use('/api/admin', admin);

app.get('/api/test', (req, res) => {
  return res.status(200).send('gotcha!')
})

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});