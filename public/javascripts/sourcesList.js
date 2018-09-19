'use strict';

var dbPromise = openIDB();

var req = new Request('https://newsapi.org/v2/sources?apiKey=f5b8df00fbc34645b92e985a0e575e29');

caches.match(req)
.then(function(cacheRes){
  if (cacheRes) return cacheRes;
  return fetch(req);
})
.then(function(res){
  return res.json();
})
.then(function(jsonData){
  displaySources(jsonData.sources);
  return jsonData.sources;
})
.then(function(sourcesList){
  dbPromise.then(function(db){
    var dbTransaction = db.transaction('headlines', 'readwrite');
	dbTransaction.objectStore('headlines').put(sourcesList, 'sources');
  });
});

var displaySources = function(data){
	var sourcesUI = document.querySelector('.source_list');
	data.forEach(function(sourceObject){
		var source = document.createElement('div');
		source.className = 'source';
		source.title = sourceObject.description;
		source.innerHTML = `<a href='/news/sources/${sourceObject.id}'>
                              <p class='name'>${sourceObject.name}</p>
							  <p class='category'>category: ${sourceObject.category}</p>
							</a>`;
        sourcesUI.appendChild(source);
	});
};