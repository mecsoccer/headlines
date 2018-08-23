var cacheName = 'headlinesPWA-v2';
var dataCacheName = 'headlinesData-v2';
var allCaches = [cacheName, dataCacheName];

self.addEventListener('install', function(event){
	console.log('[service worker] install');
	event.waitUntil(
	  caches.open(cacheName).then(function(cache){
		  console.log('[service worker] caching app shell');
		  return cache.addAll(['/', '/news', '/news/countries', '/news/sources', '/images/jaachi.jpg',
		    '/images/logo.png', '/javascripts/idb.js', '/javascripts/newsController.js', '/stylesheets/style.css', 
			'/stylesheets/responsive.css']);
	  })
	);
});

self.addEventListener('activate', function(event){
	console.log('[service worker] activate');
	event.waitUntil(
	  caches.keys().then(function(keyList){
		  return Promise.all(keyList.map(function(key){
			  if (key !== cacheName && key !== dataCacheName) {
				  console.log('[service worker] deleting old cache: ', key);
				  return caches.delete(key);
			  }
		  }));
	  })
	);
	return self.clients.claim();
});

self.addEventListener('fetch', function(event){
	console.log('[service worker] fetch', event.request.url);
	var apiKey = 'f5b8df00fbc34645b92e985a0e575e29';
	if (event.request.url.includes(apiKey)) {
		event.respondWith(
		  caches.open(dataCacheName).then(function(cache){
			  return fetch(event.request).then(function(response){
				  cache.put(event.request.url, response.clone());
				  return response;
			  });
		  })
		);
	} else {
		event.respondWith(
		  caches.match(event.request).then(function(response){
			  return response || fetch(event.request);
		  })
		);
	}
});
