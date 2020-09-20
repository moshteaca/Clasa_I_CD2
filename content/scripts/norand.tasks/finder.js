// JavaScript Document
function finderInitialize(task) {
	$(task.id).find('.task-target').each(function() {
		var targetSetup = ($(this).attr('data-setup')+'').split(',');
		$(this).append('<div class="task-question"></div>');
		for(var a = 0; a < targetSetup[0]; a++) {
			$(this).children('.task-question').append('<div class="task-answer u p'+targetSetup[a+2]+' s0" data-answer="'+(targetSetup[a+2]-1)+'"></div>');
		}
	});
	$(task.id).find('.task-target').find('.task-answer').click(function(e) {
		finderClick($(this), task);
	});
}

function finderValidate(task) {
	taskPreValidate(task);
	$(task.id+' .subpage.active .task-target').each(function() {
		var success = true;
		var targets = ($(task.id).attr('data-setup')+'').split(',');
		var variants = Number(($(this).attr('data-setup')+'').split(',')[1])+1;
		for(var m = 0; m < variants; m++) {
			for(var n = 0; n < variants; n++) {
				if(m == 0) {
					success = $(this).has('.task-answer.p0.s').length ? false : success;
				} else 	if(m != n) {
					success = $(this).has('.task-answer.p'+m+'.s'+n).length ? false : success;
				}
				
			}
		}
		$(this).find('.task-answer.p1.s0, .task-answer.p2.s0, .task-answer.p1.s2, .task-answer.p2.s1').each(function() {
			$(this).append('<div>'+targets[$(this).attr('data-answer')]+'</div>');
		});
		$(this).addClass(success ? 'success' : 'failure');
	});
	finderFeedback(task);
	taskPostValidate(task);
}

function finderFeedback(task) {
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

function finderClick(answer, task) {
	if(!taskSubpageChecked()) {
		var target = answer.parent().parent();
		var variants = Number((target.attr('data-setup')+'').split(',')[1])+1;
		var selected = 0;
		var found = false;
		for(var n = 0; n < variants; n++) {
			if(!found && answer.hasClass('s'+n)) {
				selected = (n+1)%variants;
				answer.removeClass('s'+n);
				answer.addClass('s'+selected);
				found = true;
			}
		}
		if(selected) {
			answer.addClass('s');
			answer.removeClass('u');
			soundPlay('select');
		} else {
			answer.addClass('u');
			answer.removeClass('s');
			soundPlay('deselect');
		}
		//answer.addClass(selected ? 's' : 'u');
		//answer.removeClass(selected ? 'u' : 's');
		taskOptionsOn();
		taskReady(true);
	}
}

