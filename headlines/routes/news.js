var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
	res.render('index', {title: 'news unfiltered'});
});

router.get('/country', function(req, res, next){
	res.render('countrylist', {title: 'list of countries'});
});

router.get('/country/:country', function(req, res, next){
	res.render('country', {title: 'news-' + req.params.country});
});

router.get('/source', function(req, res, next){
	res.render('source', {
		title: 'news-' + req.params.source, 
		list: ['bbc-news','cnn-news', 'aj-news']
	});
});

router.get('/source/:source', function(req, res, next){
	res.render('source', {title: 'news-' + req.params.source});
});

module.exports = router;