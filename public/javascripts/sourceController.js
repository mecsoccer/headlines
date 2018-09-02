'use strict';

var source = window.location.pathname.slice(14);

var url = `sources=${source}`;

var News = new Newscard(url);
News.getNews();