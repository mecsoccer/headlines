'use strict';

var webpush = require('web-push');
var SubscriptionModel = require('../models/push');

var vapidKeys = {
  publicKey:
'BE2pL_dnGv7mPLZytCQlTbpqfWNVm42UVP0JzX7IG1gNWTF03k7h1rm0DTujN554xscv0BTIUGkWmM0KiGviiMA',
  privateKey: 'TUhwkUlbGyjkKYgBTGUlmDYnSQAVQNrVeqpFsq24WRw'
};

webpush.setVapidDetails(
  'mailto:mecsoccerguy@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

exports.triggerPush = function (req, res) {
  return getSubscriptionsFromDatabase()
  .then(function(subscriptions) {
    var promiseChain = Promise.resolve();

    for (var i = 0; i < subscriptions.length; i++) {
      var subscription = subscriptions[i];
      promiseChain = promiseChain.then(() => {
        return triggerPushMsg(subscription, 'hello push world!!!');
      });
    }

    return promiseChain;
  })
  .then(function(){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ data: { success: true } }));
  })
  .catch(function(err) {
    res.status(500);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      error: {
        id: 'unable-to-send-messages',
        message: `We were unable to send messages to all subscriptions : ` +
          `'${err.message}'`
      }
    }));
  });
};

var triggerPushMsg = function(subscription, dataToSend) {
  return webpush.sendNotification(subscription, dataToSend)
  .catch((err) => {
    if (err.statusCode === 410) {
      return deleteSubscriptionFromDatabase(subscription._id);
    } else {
      console.log('Subscription is no longer valid: ', err);
    }
  });
};

function getSubscriptionsFromDatabase() {
  return new Promise(function(resolve, reject){
    SubscriptionModel.find(function(err, subscriptions){
	  if (err) {
		 reject(err);
		 return;
	  };
	  
	  console.log(subscriptions);
	  resolve(subscriptions);
	});
  });
};

function deleteSubscriptionFromDatabase(subscriptionId) {
  return SubscriptionModel.findOneAndDelete({_id: subscriptionId}, function(err, record){
	if (err) return err;
	return record;
  });
};