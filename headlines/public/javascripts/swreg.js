if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js').then(function(reg){
		console.log('service worker regitered. scope: ', reg.scope);
	}).catch(function(err){
		console.log('error occured');
	})
}