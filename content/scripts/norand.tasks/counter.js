// JavaScript Document

function counterInitialize(task) {
	$(task.id).find('.task-target').each(function() {
		var targetSetup = ($(this).attr('data-setup')+'').split(',');
		$(this).append('<div class="task-question"></div>');
		for(var a = 0; a < targetSetup[0]; a++) {
			$(this).children('.task-question').append('<div class="task-answer u '+(a == 0 ? 'c ' : '')+(a < targetSetup[1] ? 'p1' : 'p0')+'"></div>');
		}
	});
	$(task.id).find('.task-target').find('.task-answer').click(function(e) {
		counterClick($(this), task);
	});
}

function counterValidate(task) {
	taskPreValidate(task);
	$(task.id+' .subpage.active .task-target').each(function() {
		$(this).addClass($(this).has('.task-answer.p1.u').length + $(this).has('.task-answer.p0.s').length == 0 ? 'success' : 'failure');
	});
	counterFeedback(task);
	taskPostValidate(task);
}

function counterFeedback(task) {
	if($(task.id).hasClass('feedback')) {
		if(taskSubpageChecked()) {
			// evaluated feedback
			if($(task.id+' .subpage.active').has('.failure').length) {
				soundPlay('bad');
				$('#main-feedback').html($(task.id).find('#task-feedback-failure').html());
				if($(task.id).hasClass('retry')) {
					$('#option-retry').show(0);
				} else {
					$('#option-retry').hide(0);
				}
			} else {
				soundPlay('good');
				$('#main-feedback').html($(task.id).find('#task-feedback-success').html());
			}
		} else {
			// runtime feedback
		}
	}
}
function counterCheck(task) {
	if($(task.id).has('.task-answer.s').length) {
		taskOptionsOn();
		taskReady(true);
	} else {
		taskOptionsOff();
		taskReady(false);
	}
}

function counterClick(answer, task) {
	if(!taskSubpageChecked()) {
		if(answer.hasClass('c')) {
			var question = answer.parent();
			if(answer.hasClass('u')) {
				answer.siblings('.s.c').last().removeClass('c');
				answer.addClass('s');
				answer.removeClass('u');
				answer.siblings('.u').first().addClass('c');
				soundPlay('select');
			} else {
				answer.siblings('.u.c').last().removeClass('c');
				answer.addClass('u');
				answer.removeClass('s');
				answer.siblings('.s').last().addClass('c');
				soundPlay('deselect');
			}
			counterCheck(task);
		}
	}
}

