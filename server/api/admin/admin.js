const express = require('express');
const router = express.Router();

const {addCoupon, getCoupon} = require('../../../database/controllers/coupon.js');

// coupon API
router.post('/coupon', (req, res) => {
  // input coupon code, 
  console.log(req.body);

  addCoupon(req, res);
});

router.get('/coupon', (req, res) => {
  getCoupon(req, res);
})

module.exports = router;