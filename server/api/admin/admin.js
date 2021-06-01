const express = require('express');
const router = express.Router();

const { addCoupon, getLatestCoupon, checkCoupon } = require('../../../database/controllers/coupon.js');
const { addCause, getCauses, removeCause } = require('../../../database/controllers/cause.js');

// coupon API
router.post('/coupon', (req, res) => {
  // input coupon code, 
  console.log(req.body);

  addCoupon(req, res);
});

router.get('/latestCoupon', (req, res) => {
  getLatestCoupon(req, res);
})

router.post('/checkCoupon', (req, res) => {
  checkCoupon(req, res);
})

/////////////////////////////////////////////////
// causes API
/////////////////////////////////////////////////
router.post('/causes', (req, res) => {
  console.log(req.body);

  addCause(req, res);
})

router.get('/causes', (req, res) => {
  getCauses(req, res);
})

router.post('/remove-cause', (req, res) => {
  removeCause(req, res);
})

module.exports = router;