'use strict';

var openIDB = function(){
	//if no serviceWorker no need for a db
	if (!navigator.serviceWorker) {
		return Promise.resolve();
	}
	
	return idb.open('Headlines', 1, function(upgradeDb){
		var store = upgradeDb.createObjectStore('headlines');
		store.createIndex('time', 'publishedAt');
	});
}

var Newscard = function(queryString){
	this.queryString = queryString || "country=ng";
	this.url = 'https://newsapi.org/v2/top-headlines?' + this.queryString + '&apiKey=f5b8df00fbc34645b92e985a0e575e29';
	this.timeLastUpdated = new Date();
	this.dbPromise = openIDB();
	this.showingLatest = false;
	this.cleanImgCache;
}

//Takes an array of news articles and renders them to the browser
Newscard.prototype.renderData = function(data){
	var headlines = document.querySelector('.headline');
	data.forEach(function(article){
		var listItem = document.createElement('li');
		listItem.innerHTML = '<img src="' + article.urlToImage 
							 + '" alt="news pic"><div class="details"><strong><a class="title" href="' 
							 + article.url + '" target="_blank">' + article.title
			                 + '</a></strong><p>' + article.description + '...' + '</p></div>'
							 + '<div class="source_date_holder"><span class="source">'+ article.source.name 
							 +'</span><span class="date">'+ article.publishedAt +'</span></div>'
		headlines.appendChild(listItem);
	});
}

//clear the page of any news
Newscard.prototype.clearNewsList = function(){
	var list = document.querySelector('.headline');
	while (list.hasChildNodes()) {
		list.removeChild(list.firstChild);
	};
}

//get data from network
Newscard.prototype.networkResponse = function(){
	var newscard = this;
	var req = new Request(newscard.url);
	fetch(req).then(function(response){
		return response.json();
	}).then(function(news){
		newscard.clearNewsList();
		newscard.renderData(news.articles);
		newscard.showingLatest = true;
		return news.articles;
	}).then(function(articles){
		// store data in db immediately after network response 
		newscard.dbPromise.then(function(db){
			var dbTransaction = db.transaction('headlines', 'readwrite');
			dbTransaction.objectStore('headlines').put(articles, newscard.queryString);
		});
	});
}

//get news from network and render to the browser
Newscard.prototype.getNews = function () {
	
	var newscard = this;
	
	//if browser supports caching, check if service worker has cached this request 
	//before then respond with cached data	
	if ('caches' in window) {
		caches.match(newscard.url).then(function(response){
			if (response) return response.json();
		}).then(function(news){
			newscard.renderData(news.articles);
		});
	}
	
	newscard.networkResponse();
}

//remove unwanted photos from the cache
Newscard.prototype.cleanImgCache = function(){
	var newscard = this;
	
	return this.dbPromise.then(function(db){
		if(!db) return;
		
		var photosNeeded = [];
		
		var dbTransaction = db.transaction('headlines').objectStore('headlines');
		return dbTransaction.get(newscard.queryString).then(function(dbData){
			dbData.forEach(function(article){
				photosNeeded.push(article.urlToImage);
			});
			console.log(photosNeeded);
			return caches.open('headlinesImgs');
		}).then(function(cache){
			cache.keys().then(function(requests){
				requests.forEach(function(request){
					var url = new URL(request.url);
					if (!photosNeeded.includes(url.href)) cache.delete(request);
				});
			});
		});
	});
}

var News = new Newscard();
News.getNews();

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js').then(function(reg){
		console.log('service worker regitered. scope: ', reg.scope);
	}).catch(function(err){
		console.log('error occured');
	})
}
