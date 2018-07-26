var dbpromise = idb.open('news', 1, function(upgradedb){
	var store = upgradedb.createObjectStore('headlines', {keyPath: 'author'});
	store.createIndex('time', 'publishedAt');
});

mylist = document.querySelector('.headline');

var dbdata = [];
var fetchdata = [];

var url = 'https://newsapi.org/v2/top-headlines?' +
          'country=ng&' +
          'apiKey=f5b8df00fbc34645b92e985a0e575e29';

var req = new Request(url);

fetch(req).then(function(response){
	if (response) return response.json();
	return
}).then(function(news){
	news.articles.forEach(function(article){
		fetchdata.push(article)
	})
})

dbpromise.then(function(db){
	return db.transaction('headlines', 'readwrite')
		 .objectStore('headlines').index('time').getAll()
}).then(function(articles){
	articles.forEach(function(article){
		dbdata.push(article)
	})
}).then(function(){
	return addPosts(dbdata.reverse())
}).then(function(){
	return addPosts(fetchdata);
});

function addPosts(articleArray){
	articleArray.forEach(function(article){
		var listItem = document.createElement('li');
		listItem.innerHTML = '<img src="' + article.urlToImage 
							 + '" alt="news pic"><div><strong><a class="title" href="' 
							 + article.url + '" target="_blank">' + article.title
			                 + '</a></strong><p>' + article.description + '...' + '</p></div>'
		mylist.appendChild(listItem);
	})
}