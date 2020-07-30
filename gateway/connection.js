var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "h8fcb2htdqghy8x5",
  publicKey: "5v28dspc7vt5wm9h",
  privateKey: "c437bafc5040a8869b39a862a86d9580"
});

module.exports = gateway;