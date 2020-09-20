// JavaScript Document

function staticInitialize(task) {
	$(task.id+' .task-audio-trigger').each(function() {
		$(this).click(function(e) {
			if(!$(this).hasClass('disabled')) {
				$(this).addClass('played');
			}
		});
		$('#'+$(this).attr('data-audio')).bind('ended', function() {
			staticCheck(task);
		});
	});
}

function staticValidate(task) {
	taskOptionsOn();
	taskPreValidate(task);
}

function staticFeedback(task) {
	if((subpageCurrent+1) == subpageNum) {
		$('#main-feedback').html($(task.id).find('#task-feedback-success').html());
	}
}

function staticCheck(task) {
	var allPlayed = true;
	$(task.id+' .subpage.active .task-audio-trigger').each(function() {
		allPlayed = $(this).hasClass('played') ? allPlayed : false;
	});
	if(allPlayed) {
		staticValidate(task);
		staticFeedback(task);
	}
}
