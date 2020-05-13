require('dotenv').config();
const mongoose = require('mongoose');

// These are development variables and don't need to be srored in a .env file until production
const DB_ADDRESS = process.env.DATABASE_IP;
const DB_NAME = 'rrdev';

// Connection Check
console.log(`Connecting to IP: ${DB_ADDRESS}, Database: ${DB_NAME}`);

mongoose.connect(`mongodb://${DB_ADDRESS}/${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
  console.log('REMOTEREQ DATABASE CONENCTION SUCCESSFUL!');
});

module.exports = mongoose;