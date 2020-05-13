const express = require('express');

const router = express.Router();

// Removed until DB queries are establshed
const { getFirstFiveJobs } = require('../../../database/Controllers/Jobs.js');

router.get('/', (req, res) => {
  getFirstFiveJobs((err, data) => {
    if (err) {
      console.log(err);
      res.status(400).send();
    } else {
      console.log('returning jobs!');
      res.status(200).send(data);
    }
  });
});

module.exports = router;