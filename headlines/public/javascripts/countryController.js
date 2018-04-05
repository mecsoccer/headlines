var country = window.location.pathname.slice(16);

newslist = document.querySelector('.headline');

var url = 'https://newsapi.org/v2/top-headlines?' +
          'country=' + country + '&' +
          'apiKey=f5b8df00fbc34645b92e985a0e575e29';
var req = new Request(url);
fetch(req)
    .then(function(response) {
        return response.json();
    }).then(function(news){
		news.articles.forEach(function(article){
			var listItem = document.createElement('li');
			listItem.innerHTML = '<img src="' + article.urlToImage 
			                     + '" alt="news pic"><div><strong><a class="title" href="' 
								 + article.url + '" target="_blank">' + article.title
			                     + '</a></strong><p>' + article.description + '...' + '</p></div>'
		    newslist.appendChild(listItem);
		})
	});