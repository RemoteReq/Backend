const Coupon = require('../models/Coupon.js');

const addCoupon = async (req, res) => {

  const coupon = new Coupon({
    code: req.body.code,
    amount: req.body.amount,
    discountType: req.body.discountType,
  });

  coupon.save();

  res.status(200).send('coupon post successful!');
}

module.exports ={
  addCoupon,
}