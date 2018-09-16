'use strict';

var cacheName = 'headlinesPWA-v2';
var dataCacheName = 'headlinesData';
var imgCacheName = 'headlinesImgs';
var allCaches = [cacheName, dataCacheName, imgCacheName];

self.addEventListener('install', function(event){
	console.log('[service worker] install');
	event.waitUntil(
	  caches.open(cacheName).then(function(cache){
		  console.log('[service worker] caching app shell');
		  return cache.addAll(['/', '/news', '/news/countries', '/news/sources','/javascripts/idb.js', 
            '/javascripts/newsController.js', '/javascripts/index.js', '/javascripts/countryController.js',
			'/javascripts/sourceController.js', '/javascripts/sourcesList.js',
            '/stylesheets/style.css', '/stylesheets/responsive.css', '/images/news.PNG', 
            '/images/jaachi.jpg', '/images/icon.PNG']);
	  })
	);
});

self.addEventListener('activate', function(event){
	console.log('[service worker] activate');
	event.waitUntil(
	  caches.keys().then(function(keyList){
		  return Promise.all(keyList.map(function(key){
			  if (key !== cacheName && key !== dataCacheName && key !== imgCacheName) {
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
		return;
	}
	if (event.request.url.includes('.jpg' || '.png' || '.jpeg' || '.PNG' || '.JPEG' || '.JPG')) {
		event.respondWith(
			caches.open(imgCacheName).then(function(cache){
				return cache.match(event.request.url).then(function(response){
					if (response) return response;
					
					return fetch(event.request).then(function(networkResponse){
						cache.put(event.request.url, networkResponse.clone());
						return networkResponse;
					});
				});
			})
		);
		return;
	}
	event.respondWith(
		 caches.match(event.request).then(function(response){
			 return response || fetch(event.request);
		 })
	);
});

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Headlines update'
  const options = {
    body: 'New headlines are available. Refresh page to view them.',
    icon: 'images/icon.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://developers.google.com/web/')
  );
});