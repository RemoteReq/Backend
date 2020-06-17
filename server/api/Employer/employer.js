const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const {listEmployers, getSingleEmployerDetails} = require('../../../database/controllers/employer')

router.post('/list', listEmployers)

router.post('/getSingleEmployer', getSingleEmployerDetails)

module.exports = router