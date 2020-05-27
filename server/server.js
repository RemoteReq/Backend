const express = require('express');

// middleware
const history = require('connect-history-api-fallback');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3030;

// import route handlers
const signup = require('./api/auth/signUp.js');
const user = require('./api/auth/user');
const signin = require('./api/auth/signIn.js');
const jobs = require('./api/dashboard/jobs.js')

// Use history to intecept client requests and forward to React Router history
app.use(history());

// express middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const {tokenValidityChecking} = require('./authentication')

// routes
app.use('/api/signin', signin);
app.use('/api/signup', signup);
app.use('/api/user', tokenValidityChecking, user);
app.use('/api/jobs', jobs);

// app.get('/', (req, res) => {
//   res.status(200).send();
// });

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});