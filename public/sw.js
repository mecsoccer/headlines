var StaticCacheName = 'headlines-static-v1';

self.addEventListener('install', function(event){
	event.waitUntil(
	  caches.open(StaticCacheName).then(function(cache){
		  return cache.addAll([
		    '/javascripts/idb.js',
			'/stylesheets/responsive.css',
			'/stylesheets/style.css',
			'http://weloveiconfonts.com/api/fonts/zocial/zocial-regular-webfont.woff'
		  ]);
	  })
	)
})

self.addEventListener('activate', function(event){
	event.waitUntil(
	  caches.keys().then(function(cacheNames){
		Promise.all(
		  cacheNames.filter(function(cacheName){
			  return cacheName.startsWith('headlines-') &&
			         cacheName != StaticCacheName
		  }).map(function(cacheName){
			  return cache.delete(cacheName);
		  })
		)  
	  })
	)
})

self.addEventListener('fetch', function(event){
	event.respondWith(
	  caches.match(event.request).then(function(response){
		  if (response) return response;
		  return fetch(event.request);
	  })
	);
})