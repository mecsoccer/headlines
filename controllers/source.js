'use strict';

exports.sources = function(req, res, next){
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
};

exports.details = function(req, res, next){
	res.render('source', {title: 'news-' + req.params.source});
};