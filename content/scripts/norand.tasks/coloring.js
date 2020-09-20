// JavaScript Document

function coloringInitialize(task) {
	if($(task.id).hasClass('color-svg')) {
		$('svg g.task-target').click(function(e) {
			coloringTargetClickSVG($(this), task);
		});
		$(task.id).find('.task-answer').click(function() {
			coloringAnswerClickSVG($(this), task);
		});
	} else if($(task.id).hasClass('bubble') || $(task.id).hasClass('text')) {
		$(task.id).find('.task-target').click(function() {
			coloringTargetClick($(this), task);
		});	
		$(task.id).find('.task-answer').click(function() {
			coloringAnswerClick($(this), task);
		});
	} else {
	}
}
function coloringValidate(task) {
	taskPreValidate(task);

	if($(task.id).hasClass('color-svg')) {
		var newClasses = [];
		var classes = [];
		$(task.id+' .subpage.active svg .task-target').each(function() {
			if($(this).children('.fill').attr('fill') == $(this).attr('data-group')) {
				$(this).attr('class', $(this).attr('class')+' success');
			} else {
				$(this).attr('class', $(this).attr('class')+' failure');
			}
		});
		if($(task.id+' .subpage.active .task-answer.active').length) {
			$(task.id+' .subpage.active .task-answer.active').first().attr('filter','');
			classes = $(task.id+' .subpage.active .task-answer.active').first().attr('class').split(' ');
			for(var j = 0; j<classes.length; j++) {
				if(classes[j] != 'active') newClasses.push(classes[j]);
			}
			$(task.id+' .subpage.active .task-answer.active').first().attr('class', newClasses.join(' '));
		}
		coloringFeedback(task);
	} else if($(task.id).hasClass('bubble')) {
		$(task.id+' .subpage.active .task-target').each(function() {
			if($(this).attr('data-group') == $(this).attr('data-match')) {
				$(this).addClass('success');
			} else {
				$(this).addClass('failure');
				if($(this).attr('data-group') > 0) {
					var answer = $(task.id+' .subpage.active .task-answer[data-group='+$(this).attr('data-group')+']').first();
					$(this).css('background-color', answer.css('background-color'));
					$(this).css('border-top-color', answer.css('border-top-color'));
					$(this).css('border-right-color', answer.css('border-right-color'));
					$(this).css('border-bottom-color', answer.css('border-bottom-color'));
					$(this).css('border-left-color', answer.css('border-left-color'));				
				} else {
					$(this).css('background-color', '#FFFFFF');
					$(this).css('border-top-color', '#000000');
					$(this).css('border-right-color', '#000000');
					$(this).css('border-bottom-color', '#000000');
					$(this).css('border-left-color', '#000000');
				}
			}
			$(this).addClass($(this).attr('data-match') == $(this).attr('data-group') ? 'success' : 'failure');
		});
		coloringFeedback(task);
	} else if($(task.id).hasClass('text')) {
		$(task.id+' .subpage.active .task-target').each(function() {
			if($(this).attr('data-group') == $(this).attr('data-match')) {
				$(this).addClass('success');
			} else {
				$(this).addClass('failure');
				if($(this).attr('data-group') > 0) {
					var answer = $(task.id+' .subpage.active .task-answer[data-group='+$(this).attr('data-group')+']').first();
					$(this).css('color', answer.css('background-color'));
				} else {
					$(this).css('color', '#333333');
				}
			}
			$(this).addClass($(this).attr('data-match') == $(this).attr('data-group') ? 'success' : 'failure');
		});
		coloringFeedback(task);
	}
	taskPostValidate(task);
}
function coloringFeedback(task) {
	if($(task.id).hasClass('color-svg')) {
		var success = true;
		$(task.id+' .subpage.active svg .task-target').each(function() {
			var classes = $(this).attr('class').split(' ');
			if(classes.indexOf('failure') != -1) {
				success = false;
				$(this).children('.letter').attr('fill', '#CC071E');
			}
		});
		if(success) {
			soundPlay('good');
			$('#main-feedback').html($(task.id).find('#task-feedback-success').html());
		} else {
			soundPlay('bad');
			$('#main-feedback').html($(task.id).find('#task-feedback-failure').html());
		}
	} else if($(task.id).hasClass('bubble') || $(task.id).hasClass('text')) {
		var success = true;
		$(task.id+' .subpage.active .task-target').each(function() {
			success = $(this).hasClass('failure') ? false : success;
		});
		if(success) {
			soundPlay('good');
			$('#main-feedback').html($(task.id).find('#task-feedback-success').html());
		} else {
			soundPlay('bad');
			$('#main-feedback').html($(task.id).find('#task-feedback-failure').html());
		}
	}
}

function coloringCheck(task) {
	var ready = $(task.id+' .subpage.active .task-target.c').length > 0;
	if(ready) {
		taskOptionsOn();
		taskReady(true);
	} else {
		taskOptionsOff();
		taskReady(false);
	}
}

function coloringCheckSVG(task) {
	var ready = false;
	$(task.id+' .subpage.active svg .task-target .fill').each(function() {
		ready = $(this).attr('fill') != '#FFFFFF' ? true : ready;
	});
	if(ready) {
		taskOptionsOn();
		taskReady(true);
	} else {
		taskOptionsOff();
		taskReady(false);
	}
}

function coloringTargetClick(target, task) {
	if(!taskSubpageChecked()) {
		if($(task.id).hasClass('bubble')) {
			if($(task.id).hasClass('armed')) {
				var answer = $(task.id+' .subpage.active .task-answer.s');
				target.addClass('c');
				target.attr('data-match', answer.attr('data-group'));
				target.css('background-color', answer.css('background-color'));
				target.css('border-top-color', answer.css('border-top-color'));
				target.css('border-right-color', answer.css('border-right-color'));
				target.css('border-bottom-color', answer.css('border-bottom-color'));
				target.css('border-left-color', answer.css('border-left-color'));
				soundPlay('select');
			} else {
				target.removeClass('c');
				target.attr('data-match', '0');
				target.css('background-color', '#FFFFFF');
				target.css('border-top-color', '#000000');
				target.css('border-right-color', '#000000');
				target.css('border-bottom-color', '#000000');
				target.css('border-left-color', '#000000');
				soundPlay('deselect');
			}
			coloringCheck(task);
		} else if($(task.id).hasClass('text')) {
			if($(task.id).hasClass('armed')) {
				var answer = $(task.id+' .subpage.active .task-answer.s');
				target.addClass('c');
				target.attr('data-match', answer.attr('data-group'));
				target.css('color', answer.css('background-color'));
				soundPlay('select');
			} else {
				target.removeClass('c');
				target.attr('data-match', '0');
				target.css('color', '#333333');
				soundPlay('deselect');
			}
			coloringCheck(task);
		}
	}
}
function coloringAnswerClick(answer, task) {
	if(!taskSubpageChecked()) {
		if(answer.hasClass('s')) {
			answer.removeClass('s');
			soundPlay('deselect');
		} else {
			$(task.id+' .subpage.active .task-answer.s').removeClass('s');
			answer.addClass('s');
			soundPlay('select');
		}
		if($(task.id+' .subpage.active .task-answer.s').length) {
			$(task.id).addClass('armed');
		} else {
			$(task.id).removeClass('armed');
		}
	}
}
function coloringTargetClickSVG(target, task) {
	if(!taskSubpageChecked()) {
		if($(task.id).hasClass('instant')) {
			if($(task.id).attr('data-fill') == target.attr('data-group') || $(task.id).attr('data-fill') == '#FFFFFF') {
				target.children('.fill').attr('fill', $(task.id).attr('data-fill'));
				soundPlay('select');
			} else {
				soundPlay('deselect');
			}
		} else if(!$(task.id).hasClass('permanent')) {
			target.children('.fill').attr('fill', $(task.id).attr('data-fill'));
			if($(task.id).attr('data-fill') != '#FFFFFF' && target.children('.fill').attr('fill') == '#FFFFFF') {
				soundPlay('select');
			} else {
				soundPlay('deselect');
			}
		} else {
			if($(task.id).attr('data-fill') != '#FFFFFF' && target.children('.fill').attr('fill') == '#FFFFFF') {
				target.children('.fill').attr('fill', $(task.id).attr('data-fill'));
				soundPlay('select');
			} else {
				soundPlay('deselect');
			}
		}
		coloringCheckSVG(task);
	}
}
function coloringAnswerClickSVG(answer, task) {
	if(!taskSubpageChecked()) {
		var classes = answer.attr('class').split(' ');
		var newClasses = [];
		if(classes.indexOf('active') != -1) {
			for(var i = 0; i<classes.length; i++) {
				if(classes[i] != 'active') newClasses.push(classes[i]);
			}
			answer.attr('class', newClasses.join(' '));
			answer.attr('filter', '');
			$(task.id).attr('data-fill', '#FFFFFF');
		} else {
			if($(task.id+' .subpage.active .task-answer.active').length) {
				$(task.id+' .subpage.active .task-answer.active').first().attr('filter','');
				classes = $(task.id+' .subpage.active .task-answer.active').first().attr('class').split(' ');
				for(var j = 0; j<classes.length; j++) {
					if(classes[j] != 'active') newClasses.push(classes[j]);
				}
				$(task.id+' .subpage.active .task-answer.active').first().attr('class', newClasses.join(' '));
			}
			$(task.id).attr('data-fill', answer.attr('data-fill'));
			answer.attr('class', answer.attr('class')+' active');
			answer.attr('filter', 'url(#active)');
		}
	}
}