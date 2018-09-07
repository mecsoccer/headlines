'use strict';

var Newscard = function(queryString){

	this.queryString = queryString || "country=ng";
	this.url = 'https://newsapi.org/v2/top-headlines?' + this.queryString + '&apiKey=f5b8df00fbc34645b92e985a0e575e29';
	this.timeLastUpdated = new Date();
	this.dbPromise = openIDB();
	this.showingLatest = false;
	this.cleanImgCache;

	var newscard = this;

	setInterval(function(){
		newscard.cleanImgCache;
		triggerPushNotification();
	}, 60 * 15 * 1000);

};

var openIDB = function(){
	//if no serviceWorker no need for a db
	if (!navigator.serviceWorker) {
		return Promise.resolve();
	}
	
	return idb.open('Headlines', 1, function(upgradeDb){
		var store = upgradeDb.createObjectStore('headlines');
	});
};

//Takes an array of news articles and renders them to the browser
Newscard.prototype.renderData = function(data){
	var headlines = document.querySelector('.headline');
	data.forEach(function(article){
		var listItem = document.createElement('li');
		listItem.innerHTML = `<img src="${article.urlToImage}" alt="news pic" 
                                onerror="this.src='/images/news.PNG';">
							  <div class="details">
							    <strong>
								  <a class="title" href="${article.url}" target="_blank">${article.title}</a>
								</strong>
								<p>${article.description}...</p>
						      </div>
							  <div class="source_date_holder">
							    <span class="source">${article.source.name}</span>
								<span class="date">${article.publishedAt}</span>
							  </div>`;
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
	fetch(req)
	.then(function(response){
		return response.json();
	})
	.then(function(news){
		newscard.clearNewsList();
		newscard.renderData(news.articles);
		newscard.showingLatest = true;
		return news.articles;
	})
	.then(function(articles){
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
			if (response.ok) return response.json();
		}).then(function(news){
			newscard.renderData(news.articles);
		}).catch(function(err){
            console.log(err);
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
		return dbTransaction.get(newscard.queryString)
		.then(function(dbData){
			dbData.forEach(function(article){
				photosNeeded.push(article.urlToImage);
			});
			console.log(photosNeeded);
			return caches.open('headlinesImgs');
		})
		.then(function(cache){
			cache.keys().then(function(requests){
				requests.forEach(function(request){
					var url = new URL(request.url);
					if (!photosNeeded.includes(url.href)) cache.delete(request);
				});
			});
		});
	});
}


//service workers and push notification

var swRegistration = null;
var isSubscribed = false;

if ('serviceWorker' in navigator && 'PushManager' in window) {
	console.log('Service worker and Push is supported');
	
	navigator.serviceWorker.register('/sw.js')
	.then(function(reg){
		console.log('service worker regitered. scope: ', reg.scope);
		
		swRegistration = reg;
		initializeUI();
	})
	.catch(function(err){
		console.log('error occured');
	})
}

var applicationServerPublicKey = 'BE2pL_dnGv7mPLZytCQlTbpqfWNVm42UVP0JzX7IG1gNWTF03k7h1rm0DTujN554xscv0BTIUGkWmM0KiGviiMA';

var pushButton = document.querySelector('.pushNotification');
var triggerPush = document.querySelector('.triggerPush');

triggerPush.addEventListener('click', triggerPushNotification());

function urlB64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function initializeUI() {
	
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });
	
  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

function updateBtn() {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed.');

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}

function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      return subscription.unsubscribe();
    }
  })
  .catch(function(error) {
    console.log('Error unsubscribing', error);
  })
  .then(function() {
    updateSubscriptionOnServer(null);

    console.log('User is unsubscribed.');
    isSubscribed = false;

    updateBtn();
  });
}

function updateSubscriptionOnServer(subscription) {
  return fetch('/news/api/save-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription)
  })
  .then(function(response) {
    if (!response.ok) {
      throw new Error('Bad status code from server.');
    }

    return response.json();
  })
  .then(function(responseData) {
    if (!(responseData.data && responseData.data.success)) {
      throw new Error('Bad response from server.');
    }
  });
}

function triggerPushNotification(){
  return fetch('/news/api/trigger-push-msg', {
	method: 'POST'
  })
  .then(function(response){
	if (!response.ok) {
      throw new Error('Bad status code from server.');
    }

    return response.json();
  })
  .then(function(responseData) {
    if (!(responseData.data && responseData.data.success)) {
      throw new Error('Bad response from server.');
    }
  });
};