'use strict';

var SubscriptionModel = require('../models/push');

exports.saveSubscription = function (req, res) {
  // Check the request body has at least an endpoint.
  if (!req.body || !req.body.endpoint) {
    // Not a valid subscription.
    res.status(400);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      error: {
        id: 'no-endpoint',
        message: 'Subscription must have an endpoint.'
      }
    }));
    return;
  }
  
  return saveSubscriptionToDatabase(req.body)
  .then(function(subscriptionId) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ data: { success: true, subscriptionId: subscriptionId } }));
  })
  .catch(function(err) {
    res.status(500);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      error: {
        id: 'unable-to-save-subscription',
        message: 'The subscription was received but we were unable to save it to our database.'
      }
    }));
  });

}

function saveSubscriptionToDatabase(subscription) {
  return new Promise(function(resolve, reject) {
	SubscriptionModel.create(subscription, function(err, newDoc){
	  if (err) {
		reject(err);
		return;
	  };
	
	  resolve(newDoc._id);
	});
  });
};