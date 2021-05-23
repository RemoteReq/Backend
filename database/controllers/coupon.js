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

const getCoupon = async (req, res) => {

  const coupon = await Coupon.find({}).sort({_id: -1}).limit(1).then((coupons) => {
    console.log(coupons[0]);
  })

  res.status(200).send(coupon);
}


module.exports ={
  addCoupon,
  getCoupon,
}