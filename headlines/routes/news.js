var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
	res.render('index', {title: 'news unfiltered'});
});

router.get('/countries', function(req, res, next){
	res.render('countrylist', {
		title: 'list of countries',
		list: [
		       {country: 'nigeria', url: '/news/countries/ng'},
               {country: 'us', url: '/news/countries/us'},
			   {country: 'uk', url: '/news/countries/uk'}
			  ]
	});
});

router.get('/countries/:country', function(req, res, next){
	res.render('country', {title: 'news-' + req.params.country});
});

router.get('/sources', function(req, res, next){
	res.render('sourcelist', {
		title: 'list of sources', 
		list: [
		       {source: 'bbc-news', url: '/news/sources/bbc-news'},
			   {source: 'cnn', url: '/news/sources/cnn'},
			   {source: 'al-jazeera-english', url: '/news/sources/al-jazeera-english'}
			  ]
	});
});

router.get('/sources/:source', function(req, res, next){
	res.render('source', {title: 'news-' + req.params.source});
});

module.exports = router;