'use strict';

exports.countries = function(req, res, next){
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
};

exports.details = function(req, res, next){
	res.render('country', {title: 'news-' + req.params.country});
}