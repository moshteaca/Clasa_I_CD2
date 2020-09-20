// JavaScript Document
var localStorageSupport = (localStorage || window.localStorage) ? true : false;
$(document).ready(function(e) {
	if(localStorageSupport) {
		localStorage.setItem('page', $('#page-wrapper').html());
	}
});
