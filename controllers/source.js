'use strict';

exports.sources = function(req, res, next){
	res.render('sourcelist', { title: 'list of sources' });
};

exports.details = function(req, res, next){
	res.render('source', {title: 'news-' + req.params.source});
};