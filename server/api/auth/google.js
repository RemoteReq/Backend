const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/verify', (req, res) => {
  const token = req.body.tokenId;

  

});

module.exports = router;