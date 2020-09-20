// JavaScript Document

var storyInterval;
var storyCurrent;
function storyInitialize(task) {
	storyCheck(task);
	$('#story-start').click(function() {
		storyCurrent = $('.audio-task-story#'+$(this).attr('data-audio')).get(0);;
		if(storyCurrent.paused) {
			storyProgress(0);
			storyInterval = setInterval(storyTick, 1000);
			//console.log('Start tick...');
		} else {
			storyProgress(0);
			clearInterval(storyInterval);
			//console.log('Stop tick.');
		}
	});
	storyProgress(0);
}

function storyTick() {
	if(storyCurrent.paused) {
		clearInterval(storyInterval);
		//console.log('Stop tick.');
	}
	storyProgress(Math.floor(storyCurrent.currentTime));
}
function storyProgress(playhead) {
	$('.task-answer').each(function() {
		if($(this).attr('data-setup')) {
			var thisInterval = $(this).attr('data-setup').split(',');
			if(playhead >= thisInterval[0] && playhead < thisInterval[1]) {
				if(!$(this).hasClass('active')) $(this).addClass('active');
			} else {
				if($(this).hasClass('active')) $(this).removeClass('active');
			}
		}
	});
}
function storyValidate(task) {
	taskPreValidate(task);
	taskReady(false);
	storyFeedback(task);
}

function storyFeedback(task) {
	$('#main-feedback').html('');
}

function storyCheck(task) {
	storyValidate(task);
}

