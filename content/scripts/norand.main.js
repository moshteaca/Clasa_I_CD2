// Global variables

// Sound
var soundEnabled = false;
var soundVolume = 0;
function optionSound() {
	if(soundEnabled) {
		soundOFF();
	} else {
		soundON();
	}
}
// Fullscreen
var fullscreenSupport = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
var fullscreenEnabled = false;
function optionFullscreen() {
	if(fullscreenEnabled) {
		fullscreenOFF();
		soundPlay('deselect');
	} else {
		fullscreenON(document.documentElement);
		soundPlay('select');
	}
}
function fullscreenON(element) {
	$('#option-fullscreen').addClass('active');
	if(element.requestFullScreen) {
		element.requestFullScreen();
		fullscreenEnabled = true;
	} else if(element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
		fullscreenEnabled = true;
	} else if(element.webkitRequestFullScreen) {
		element.webkitRequestFullScreen();
		fullscreenEnabled = true;
	} else {
		fullscreenSupport = false;
	}
}
function fullscreenOFF() {
	$('#option-fullscreen').removeClass('active');
	if(document.cancelFullScreen) {
		document.cancelFullScreen();
		fullscreenEnabled = false;
	} else if(document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
		fullscreenEnabled = false;
	} else if(document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen();
		fullscreenEnabled = false;
	}
}

// Task logical variables
var isTask;
var isTaskPage;

// Misc functions
function scrollToTop() {
	$('#main-drop-area').scrollTop(0);
}
function devmap() {
	var pages = pageManifest.pages;
	var subpages;
	var output = '';
	for(var p = 0; p < pages.length; p++) {
		var page = pages[p];
		var pageName = (page.url+'').split('/');
		pageName = pageName[pageName.length-1].replace('chapter_','').replace('.html','');
		subpages = page.children;
		output += '<div class="devmap-page">';
		output += '<div class="button" data-function="local" data-url="'+page.url+'">'+pageName+'</div>';
		output += subpages.length ? '<div class="devmap-subpages">' : '';
		for(var sp = 0; sp < subpages.length; sp++) {
			var subpage = subpages[sp];
			var subpageName = (subpage+'').split('/');
			subpageName = subpageName[subpageName.length-1].replace('.html','');
			output += '<div class="button" data-function="local" data-url="'+subpage+'">'+subpageName+'</div>';
		};
		output += subpages.length ? '</div></div>' : '</div>';
	}
	$('#devmap').html(output);
	$('#devmap .button').click(function(e) {
		pageURL = $(this).attr('data-url');
		pageLoad();
	});
}
// Page functions
var localStorageSupport = (localStorage || window.localStorage) ? true : false;
var pageOK = false;
var pageURL = '';
var pageNextURL = '';
var pagePrevURL = '';
var subpageOK = false;
var subpageNum = 0;
var subpageCurrent = 0;
var subpageMaintain = false;
function pageReady() {
	pageOK = true;
	if(shutterOK) {
		pageRefresh();
	}
}
function pageNext() {
	pageURL = pageNextURL;
	pageLoad();
}
function pagePrev() {
	pageURL = pagePrevURL;
	pageLoad();
}
function pageLoad() {
	taskOptionsOff();
	soundPlay('page');
	shutterIn();
	isTaskPage = false;
	for(var p in pageManifest.pages) {
		for(var c in pageManifest.pages[p].children) {
			isTaskPage = pageURL == pageManifest.pages[p].children[c] ? true : isTaskPage;
		}
	}
	if(localStorageSupport) {
		if(localStorage.getItem('page')) localStorage.removeItem('page');
		$('#loader-local').bind('load', pageReady);
		$('#loader-local').attr('src', pageURL);
	} else {
		$.ajaxSetup({
			xhr: function() {
				if ('ActiveXObject' in window) return new ActiveXObject("Microsoft.XMLHTTP");
				return new XMLHttpRequest();
			}
		});
		$('#loader-ajax').load(pageURL, pageReady);
	}
}
function pageReload() {
	pageLoad();
}
function pageRefresh() {
	var fetched = '';
	if(localStorageSupport) {
		if(localStorage.getItem('page')) {
			fetched = localStorage.getItem('page');
			$('#loader-local').unbind('load');
			$('#loader-local').attr('src', '');
		} else {
			fetched = '<h1>localStorage error!</h1>';
			$('#loader-local').unbind('load');
			$('#loader-local').attr('src', '');
		}
	} else {
		fetched = $('#loader-ajax').children('#page-wrapper').html();
		$('#loader-ajax').html('');
	}
	// Populate main area
	$('#main-drop-area #dropper').html(pageFixURLs(fetched, pageURL));
	// Refresh options
	if($('#main-drop-area #dropper').has('#page-container')) {
		pageOptions();
		subpageRefresh();
		taskInitialize();
		if($('#page-container').hasClass('devmap')) devmap();
	}
	pageOK = false;
	soundInitialize();
	shutterOut();
	scrollToTop();
}
function pageOptions() {
	if($('#page-container').hasClass('contents')) {
		$('.contents .button').click(function(e) {
			pageURL = $(this).attr('data-url');
			pageLoad();
		});
		pagePrevURL = '';
		pageNextURL = '';
	} else if($('#page-container').hasClass('chapter')) {
		// Standard page (belonging to chapter)
		var pageDef;
		var childDef;
		for(var p = 0; p < pageManifest.pages.length; p++) {
			pageDef = pageManifest.pages[p];
			childDef = pageDef.children;
			if(pageURL == pageDef.url) {
				// Top level page
				if(childDef.length) {
					pageNextURL = childDef[0];
				} else {
					if(p < pageManifest.pages.length-1) {
						pageNextURL = pageManifest.pages[p+1].url;
					} else {
						pageNextURL = pageManifest.pages[0].url;
					}
				}
				var pagePrevDef = (p > 0 ? pageManifest.pages[p-1] : pageManifest.pages[pageManifest.pages.length-1]);
				var childPrevDef = pagePrevDef.children;
				pagePrevURL = childPrevDef.length ? childPrevDef[childPrevDef.length-1] : pagePrevDef.url;
			} else if(childDef.length) {
				// Child Page
				for(var cp = 0; cp < childDef.length; cp++) {
					if(pageURL == childDef[cp]) {
						if(cp < childDef.length-1) {
							pageNextURL = childDef[cp+1];
						} else {
							if(p < pageManifest.pages.length-1) {
								pageNextURL = pageManifest.pages[p+1].url;
							} else {
								pageNextURL = pageManifest.pages[0].url;
							}
						}
						if(cp > 0) {
							pagePrevURL = childDef[cp-1];
						} else {
							pagePrevURL = pageManifest.pages[p].url;
						}
					}
				}
			}
		}
	} else if($('#page-container').hasClass('preface')) {
		pageNextURL = pageManifest.help;
	} else if($('#page-container').hasClass('help')) {
		pageNextURL = pageManifest.contents;
	} else if($('#page-container').hasClass('devmap')) {
		
	}
	// Refresh title
	if($('#page-container').attr('data-title-id')) {
		pageTitle($('#page-container').attr('data-title-id'));
	} else {
		pageTitle('contents');
	}
	// Refresh footer options
	if($('#page-container').hasClass('contents') || $('#page-container').hasClass('preface')) {
		$('.button#option-contents').hide(0);
	} else {
		$('.button#option-contents').show(0);
	}
	if(pageNextURL.length) {
		$('.button#option-next').show(0);
	} else {
		$('.button#option-next').hide(0);
	}
	if(pagePrevURL.length) {
		$('.button#option-prev').show(0);
	} else {
		$('.button#option-prev').hide(0);
	}
	if(!$('#main-container').hasClass('active')) $('#main-container').addClass('active');
}
function pageFixURLs(input, url) {
	var output = input;
	var depth = url.split('/').length-1;
	for(var d = depth; d > 0; d--) {
		var str_s = '';
		var str_r = '';
		for(var s = 0; s < d; s++) str_s += '../';
		for(var r = 0; r < depth-d; r++) str_r += url.split('/')[r]+'/';
		while(output.indexOf(str_s) != -1) output = output.replace(str_s, str_r);
	}
	return output;
}
function pageTitle(id) {
	$('#main-title').removeClass('vowel');
	$('#main-title').removeClass('consonant');
	$('#main-title').removeClass('system');
	var icons = '';
	if(pageTitles[id]) {
		$('#main-title').addClass(pageTitles[id].type);
		$('#main-title').children('.main-title-label').html('<h3>'+pageTitles[id].label+'</h3>');
		for(var i in pageTitles[id].icons) {
			icons += '<img src="'+pageTitles[id].icons[i]+'" alt=" ">';
		};
	} else {
		$('#main-title').addClass('system');
		$('#main-title').children('.main-title-label').html('<h3>Page title error!</h3>');
	}
	$('#main-title').children('.main-title-icons').html(icons);
}
function subpageSet(index) {
	taskOptionsOff();
	subpageCurrent = index;
	soundPlay('page');
	
	$('#page-container').find('.subpage.active').removeClass('active');
	setTimeout(function() {
		scrollToTop();
		$('#page-container').find('.subpage').each(function() {
			$(this).css('display', ($(this).attr('id') == "subpage-"+subpageCurrent ? 'block' : 'none'));
		});
		$('#page-container').find('.subpage#subpage-'+subpageCurrent).addClass('active');
		if(isTask) taskUpdate();
		if($('.subpage.active').first().has('.task-results').length > 0) {
			taskShowResults('#'+$('.subpage.active .task-results').first().attr('id'));
		}
	}, 250);
}
function subpageRefresh() {
	if($('#page-container').has('.subpage')) {
		subpageOK = true;
		subpageNum = $('#page-container').find('.subpage').length;
		if(!subpageMaintain) subpageCurrent = 0;
		subpageMaintain = false;
	} else {
		subpageOK = false;
		subpageNum = 0;
		subpageCurrent = 0;
	}
	subpageSet(subpageCurrent);
}
function subpageNext() {
	subpageSet(subpageCurrent+1);
}
function subpagePrev() {
	subpageSet(subpageCurrent-1);
}
function subpageReload() {
	subpageMaintain = true;
	pageReload();
}

// Loader shutter
var shutterOK = false;
function shutterIn() {
	$('#main-shutter').addClass('active');
	$('#main-shutter').animate({opacity: 1}, {duration: 200, complete: shutterReady});
}
function shutterOut() {
	$('#main-shutter').animate({opacity: 0}, {duration: 300, complete: function(e) {
		$('#main-shutter').removeClass('active');
		shutterOK = false;
	}});
}
function shutterReady() {
	shutterOK = true;
	if(pageOK) {
		pageRefresh();
	}
}

// Options
function optionNext() {
	if(subpageOK && subpageCurrent < subpageNum - 1 && !isTaskPage) {
		subpageNext();
	} else {
		pageNext();
	}
}
function optionPrev() {
	if(subpageOK && subpageCurrent > 0 && !isTaskPage) {
		pageReload();
	} else {
		pagePrev();
	}
}
function optionDone() {
	if(subpageOK && subpageCurrent < subpageNum - 1) {
		subpageNext();
	} else {
		pageNext();
	}
}
function optionPreface() {
	taskOptionsOff();
	pageURL = pageManifest.preface;
	pageLoad();
}
function optionContents() {
	taskOptionsOff();
	pageURL = pageManifest.contents;
	pageLoad();
}
function optionHelp() {
	taskOptionsOff();
	pageURL = pageManifest.help;
	pageLoad();
}

// Initialization
function initialize() {
	$('html').addClass(versionIE);
	if(fullscreenSupport) {
		$('#option-fullscreen').show(0);
	} else {
		$('#option-fullscreen').hide(0);
	}
	// Header options
	$('.button#option-fullscreen').click(optionFullscreen);
	$('.button#option-sound').click(optionSound);
	$('.button#option-contents').click(optionContents);
	$('.button#option-help').click(optionHelp);
	// Footer options
	$('.button#option-next').click(optionNext);
	$('.button#option-prev').click(optionPrev);
	
	optionPreface();
	setTimeout(soundON, 250);
}

$(window).load(initialize);
