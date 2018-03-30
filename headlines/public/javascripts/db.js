var dbpromise = idb.open('news', 1, function(upgradedb){
	var store = upgradedb.createObjectStore('headlines', {keyPath: 'author'});
	store.createIndex('time', 'publishedAt');
});

mylist = document.querySelector('.headline');

dbpromise.then(function(db){
	return db.transaction('headlines')
	.objectStore('headlines').getAll().then(function(data){
		data.forEach(function(dat){
			var listItem = document.createElement('li');
			listItem.innerHTML = '<img src="" alt="news pic"><strong><a href="">' + dat.title
			                     + '</a></strong><p>' + dat.description + '...' + '</p>'
		    mylist.appendChild(listItem);
		})
	})
});