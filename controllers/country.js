'use strict';

exports.countries = function(req, res, next){
	res.render('countrylist', {
		title: 'list of countries',
		list: [
		       {country: 'Brazil', url: '/news/countries/br', abbrev: 'br'},
			   {country: 'China', url: '/news/countries/cn', abbrev: 'cn'},
			   {country: 'Cuba', url: '/news/countries/cu', abbrev: 'cu'},
			   {country: 'Egypt', url: '/news/countries/eg', abbrev: 'eg'},
			   {country: 'France', url: '/news/countries/fr', abbrev: 'fr'},
			   {country: 'Malaysia', url: '/news/countries/my', abbrev: 'my'},
			   {country: 'Nigeria', url: '/news/countries/ng', abbrev: 'ng'},
			   {country: 'Germany', url: '/news/countries/de', abbrev: 'de'},
			   {country: 'Israel', url: '/news/countries/ie', abbrev: 'ie'},
			   {country: 'Russia', url: '/news/countries/ru', abbrev: 'ru'},
			   {country: 'South Africa', url: '/news/countries/za', abbrev: 'za'},
			   {country: 'UAE', url: '/news/countries/ae', abbrev: 'ae'},
               {country: 'US', url: '/news/countries/us', abbrev: 'us'},
			   {country: 'UK', url: '/news/countries/uk', abbrev: 'uk'},
			  ]
	});
};

exports.details = function(req, res, next){
	res.render('country', {title: 'news-' + req.params.country});
}