const Coupon = require('../models/Coupon.js');

const addCoupon = async (req, res) => {

  // delete all coupons before adding a new one

  await Coupon.deleteMany({});

  const coupon = new Coupon({
    code: req.body.code,
    amount: req.body.amount,
    discountType: req.body.discountType,
    appliesToAccessFee: req.body.appliesToAccessFee,
    appliesToHireFee: req.body.appliesToHireFee,
  });
  
  coupon.save();
  
  res.status(200).send('coupon post successful!');

}

const getLatestCoupon = async (req, res) => {

  const coupon = await Coupon.find({});

  res.status(200).send(coupon);
}

const checkCoupon = async (req, res) => {

  const {code} = req.body;

  const check = await Coupon.findOne({"code": code}).then(item => {
    console.log(item);

    res.status(200).send(item);
  })
}


module.exports ={
  addCoupon,
  getLatestCoupon,
  checkCoupon,
}