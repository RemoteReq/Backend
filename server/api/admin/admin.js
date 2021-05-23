const express = require('express');
const router = express.Router();

const {addCoupon, getLatestCoupon, checkCoupon} = require('../../../database/controllers/coupon.js');

// coupon API
router.post('/coupon', (req, res) => {
  // input coupon code, 
  console.log(req.body);

  addCoupon(req, res);
});

router.get('/latestCoupon', (req, res) => {
  getLatestCoupon(req, res);
})

router.get('/checkCoupon', (req, res) => {
  checkCoupon(req, res);
})

module.exports = router;