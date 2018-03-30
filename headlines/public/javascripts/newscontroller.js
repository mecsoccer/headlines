var url = 'https://newsapi.org/v2/top-headlines?' +
          'country=us&' +
          'apiKey=f5b8df00fbc34645b92e985a0e575e29';
var req = new Request(url);
var news;
fetch(req)
    .then(function(response) {
        return response.json();
    }).then(function(data){
		console.log(data.articles);
	});
	
module.exports = news;