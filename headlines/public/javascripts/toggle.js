var menu = document.querySelector('.menu');
var main = document.querySelector('.headline');
var nav = document.querySelector('.nav-bar');

menu.addEventListener('click', function(e){
	nav.classList.toggle('open');
	e.stopPropagation();
});

main.addEventListener('click',function(){
	nav.classList.remove('open');
});