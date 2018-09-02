'use strict';

var country = window.location.pathname.slice(16);

var url = `country=${country}`;

var News = new Newscard(url);
News.getNews();