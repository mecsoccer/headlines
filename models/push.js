var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var subscriptionSchema = new Schema(
  {
	  endpoint: {type: String},
	  expirationTime: {type: String},
	  keys: { p256dh: { type: String }, auth: {type: String} }
  }
);

module.exports = mongoose.model('subscription', subscriptionSchema);