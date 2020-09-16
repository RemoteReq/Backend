var braintree = require("braintree");

// var gateway = braintree.connect({
//   environment: braintree.Environment.Sandbox,
//   merchantId: "h8fcb2htdqghy8x5",
//   publicKey: "5v28dspc7vt5wm9h",
//   privateKey: "c437bafc5040a8869b39a862a86d9580"
// });
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "sg7957qr2s9f74fn",
  publicKey: "8mnh3cbt795dwxct",
  privateKey: "88fed2983b5ad2b182d139711206018b"
});

module.exports = gateway;