if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js').then(function(reg){
		console.log('service worker regitered. scope: ', reg.scope);
	}).catch(function(err){
		console.log('error occured');
	})
}

var dbpromise = idb.open('news', 1, function(upgradedb){
	var store = upgradedb.createObjectStore('headlines', {keyPath: 'author'});
	store.createIndex('time', 'publishedAt');
})

var req = new URL('https://newsapi.org/v2/top-headlines?' +
                  'sources=cnn&' +
                  'apiKey=f5b8df00fbc34645b92e985a0e575e29');
				  
var res = fetch(req).then(function(response){
	return response.json();
}).then(function(data){
	return data.articles
});

dbpromise.then(function(db){
	res.then(function(endpoint){
		endpoint.forEach(function(article){
			db.transaction('headlines', 'readwrite')
			.objectStore('headlines').put(article);
		})
	});
	return db
}).then(function(db){
	db.transaction('headlines', 'readwrite').objectStore('headlines')
	.index('time').openCursor(null, "prev").then(function(cursor){
		return cursor.advance(20);
	}).then(function deleteRest(cursor){
		if (!cursor) return;
		cursor.delete()
		return cursor.continue().then(deleteRest);
	})
});
