var braintree = require("braintree");

var gateway = braintree.connect({
  environment: (process.env.HOST_TYPE == 'live')? braintree.Environment.Production : braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY
});
// console.log("gateway", gateway)
module.exports = gateway;