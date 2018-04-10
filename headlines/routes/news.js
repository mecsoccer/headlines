var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
	res.render('index', {title: 'news unfiltered'});
});

router.get('/countries', function(req, res, next){
	res.render('countrylist', {
		title: 'list of countries',
		list: [
		       {country: 'Brazil', url: '/news/countries/br'},
			   {country: 'China', url: '/news/countries/cn'},
			   {country: 'Cuba', url: '/news/countries/cu'},
			   {country: 'Egypt', url: '/news/countries/eg'},
			   {country: 'France', url: '/news/countries/fr'},
			   {country: 'Malaysia', url: '/news/countries/my'},
			   {country: 'Nigeria', url: '/news/countries/ng'},
			   {country: 'Germany', url: '/news/countries/de'},
			   {country: 'Israel', url: '/news/countries/ie'},
			   {country: 'Russia', url: '/news/countries/ru'},
			   {country: 'South Africa', url: '/news/countries/za'},
			   {country: 'UAE', url: '/news/countries/ae'},
               {country: 'US', url: '/news/countries/us'},
			   {country: 'UK', url: '/news/countries/uk'},
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
		       {source: 'Al Jazeera English', url: '/news/sources/al-jazeera-english'},
			   {source: 'BBC News', url: '/news/sources/bbc-news'},
			   {source: 'Business Insider', url: '/news/sources/business-insider'},
			   {source: 'CNN', url: '/news/sources/cnn'},
			   {source: 'Google News', url: '/news/sources/google-news'},
			   {source: 'Metro', url: '/news/sources/metro'},
			   {source: 'Mirror', url: '/news/sources/mirrow'},
			   {source: 'MSNBC', url: '/news/sources/msnbc'},
			   {source: 'New Scientist', url: '/news/sources/new-scientist'},
			   {source: 'News24', url: '/news/sources/news24'},
			   {source: 'Reuters', url: '/news/sources/reuters'},
			   {source: 'The Economist', url: '/news/sources/the-economist'},
			   {source: 'Politico', url: '/news/sources/politico'},
			  ]
	});
});

router.get('/sources/:source', function(req, res, next){
	res.render('source', {title: 'news-' + req.params.source});
});

module.exports = router;