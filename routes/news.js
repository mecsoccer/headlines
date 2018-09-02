'use script';

var express = require('express');
var saveSubscription = require('../controllers/saveSubscription');
var triggerPush = require('../controllers/triggerPush');
var countries = require('../controllers/country');
var sources = require('../controllers/source');

var router = express.Router();

router.get('/', function(req, res, next){
	res.render('index', {title: 'news unfiltered'});
});

router.get('/countries', countries.countries);

router.get('/countries/:country', countries.details);

router.get('/sources', sources.sources);

router.get('/sources/:source', sources.details);

router.post('/api/save-subscription', saveSubscription.saveSubscription); 

router.post('/api/trigger-push-msg', triggerPush.triggerPush);

module.exports = router;