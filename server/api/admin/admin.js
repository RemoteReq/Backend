const express = require('express');
const router = express.Router();

const {addCoupon, getLatestCoupon} = require('../../../database/controllers/coupon.js');

// coupon API
router.post('/coupon', (req, res) => {
  // input coupon code, 
  console.log(req.body);

  addCoupon(req, res);
});

router.get('/couponByName', (req, res) => {
  
})

router.get('/latestCoupon', (req, res) => {
  getLatestCoupon(req, res);
})

module.exports = router;