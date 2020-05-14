const express = require('express');

const router = express.Router();

// import controller methods here from database
const {
  addUser,
  listUsers
} = require('../../../database/controllers/user.js');

// route handlers


router.post('/list', listUsers);



module.exports = router;