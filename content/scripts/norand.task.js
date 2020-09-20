// JavaScript Document
var tasks;
var taskCurrent;
function taskInitialize() {
	if($('#main-container').find('.task').length) {
		isTask = true;
		tasks = [];
		taskCurrent = {
			id: '',
			pages: []
		};
		$('#main-container').find('.task').each(function() {
			taskSetup($(this).attr('id'));
		});
		
		$('#option-submit').unbind('click');
		$('#option-done').unbind('click');
		$('#option-retry').unbind('click');
		$('#option-submit').click(function(e) {
			taskSubmit();
		});
		$('#option-done').click(function(e) {
			taskContinue();
		});
		$('#option-retry').click(function(e) {
			taskRetry();
		});
		
		taskUpdate();
	} else {
		isTask = false;
		taskOptionsOff();
	}
}
function taskExtra(extra) {
	if(extra.hasClass('question')) {
		extra.find('.task-answer').each(function() {
			$(this).click(function(e) {
				if(!taskSubpageChecked()) {
					var group = $(this).attr('data-group');
					if(group) {
						$(this).parents('.question').find('.task-answer').each(function() {
							if($(this).attr('data-group') == group && $(this).hasClass('s')) {
								$(this).removeClass('s');
							}
						});
					}
					if($(this).hasClass('s')) {
						$(this).removeClass('s');
					} else {
						$(this).addClass('s');
					}
				}
			});
		});
	}
}
function taskSetup(id) {
	var task = {
		id: '#'+id,
		pages: []
	}
	$(task.id).children('.subpage').each(function() {
		$(this).addClass('not-checked');
		task.pages.push('#'+$(this).attr('id'));
	});
	tasks.push(task);

	switch($(task.id).attr('data-task')) {
		case 'picker':
			pickerInitialize(task);
			break;
		case 'counter':
			counterInitialize(task);
			break;
		case 'finder':
			finderInitialize(task);
			break;
		case 'quiz':
			quizInitialize(task);
			break;
		case 'match':
			matchInitialize(task);
			break;
		case 'dragger':
			draggerInitialize(task);
			break;
		case 'coloring':
			coloringInitialize(task);
			break;
		case 'static':
			staticInitialize(task);
			break;
		case 'story':
			storyInitialize(task);
			break;
		default:
			break;
	}
	$(task.id).find('.task-extra').each(function() {
		taskExtra($(this));
	});
}
function taskUpdate() {
	if($('.subpage.active').length) {
		for(var t = 0; t < tasks.length; t++) {
			$(tasks[t].id).removeClass('active');
			if(tasks[t].pages.indexOf('#'+$('.subpage.active').attr('id')) != -1 && tasks[t].id != taskCurrent.id) {
				taskCurrent = tasks[t];
				$(taskCurrent.id).addClass('active');
			}
		}
		taskOptionsOff();
	}
}
function taskReady(ready) {
	if(ready) {
		$('#option-submit').show(0);
	} else {
		$('#option-submit').hide(0);
	}
}
function taskPreValidate(task) {
	var continueConditions = false;
	switch($(taskCurrent.id).attr('data-task')) {
		case 'picker':
		case 'counter':
		case 'finder':
		case 'quiz':
		case 'match':
		case 'dragger':
		case 'coloring':
		case 'static':
			continueConditions = ((task.pages.length > 1 && task.pages[task.pages.length-1] != '#'+$('.subpage.active').first().attr('id')) || $(task.id).hasClass('continue'));
			break;
		case 'story':
			continueConditions = true;
			break;
		default:
			break;
	}
	$('.subpage.active').removeClass('not-checked');
	$('.subpage.active').addClass('checked');
	$('#option-submit').hide(0);
	if(continueConditions) {
		$('#option-done').show(0);
	} else {
		$('#option-done').hide(0);
	}
}
function taskPostValidate(task) {
	taskUpdateResults(task);
}
function taskSubmit() {
	switch($(taskCurrent.id).attr('data-task')) {
		case 'picker':
			pickerValidate(taskCurrent);
			break;
		case 'counter':
			counterValidate(taskCurrent);
			break;
		case 'finder':
			finderValidate(taskCurrent);
			break;
		case 'quiz':
			quizValidate(taskCurrent);
			break;
		case 'match':
			matchValidate(taskCurrent);
			break;
		case 'dragger':
			draggerValidate(taskCurrent);
			break;
		case 'coloring':
			coloringValidate(taskCurrent);
			break;
		case 'static':
			staticValidate(taskCurrent);
		case 'story':
			storyValidate(taskCurrent);
			break;
		default:
			break;
	}
}
function taskContinue() {
	switch($(taskCurrent.id).attr('data-task')) {
		case 'picker':
		case 'story':
			break;
		case 'static':
		case 'counter':
		case 'finder':
		case 'quiz':
		case 'match':
		case 'dragger':
		case 'coloring':
			optionDone();
			break;
		default:
			break;
	}
}
function taskRetry() {
	switch($(taskCurrent.id).attr('data-task')) {
		case 'picker':
			subpageReload();
			break;
		case 'static':
		case 'story':
		case 'counter':
		case 'finder':
		case 'quiz':
		case 'match':
		case 'dragger':
		case 'coloring':
		default:
			break;
	}
}
function taskOptionsOn() {
	$('#main-options').removeClass('disabled');
	$('#main-options').addClass('enabled');
}
function taskOptionsOff() {
	$('#main-options').removeClass('enabled');
	$('#main-options').addClass('disabled');
	$('#main-feedback').html('');
	$('#option-submit').hide(0);
	$('#option-done').hide(0);
	$('#option-retry').hide(0);
}
function taskSubpageChecked() {
	return ($('.subpage.active').hasClass('checked') && !$('.subpage.active').hasClass('not-checked'));
}
function taskUpdateResults(task) {
	if($(task.id).hasClass('task-test') && $(task.id).has('.subpage.checked').length) {
		var deductScore, currentScore;
		currentScore = Number($(task.id+' .task-score').first().attr('data-score-base'));
		//console.log(currentScore);
		switch($(task.id).attr('data-task')) {
			case 'picker':
				break;
			case 'counter':
				deductScore = $(task.id+' .task-target.failure').length;
				currentScore -= deductScore;
				break;
			case 'finder':
				deductScore = $(task.id+' .task-target.failure').length;
				currentScore -= deductScore;
				break;
			case 'quiz':
				if($(task.id).hasClass('table')) {
					if($(task.id).hasClass('prefilled')) {
						deductScore = $(task.id+' .task-answer.p1').length+$(task.id+' .task-answer.p0.s').length-$(task.id+' .task-answer.p1.s').length;
					} else {
						deductScore = $(task.id+' .task-answer.p1').length-$(task.id+' .task-answer.p1.s').length;
					}
				} else {
					deductScore = $(task.id+' .task-target.failure').length;
				}
				currentScore -= deductScore;
				break;
			case 'match':
				deductScore = $(task.id+' .task-target.failure').length;
				currentScore -= deductScore;
				break;
			case 'dragger':
				if($(task.id).hasClass('houser') || $(task.id).hasClass('attach')) {
					if($(task.id).hasClass('adaptive')) {
						deductScore = $(task.id+' .task-target-group.failure').length;
					} else {
						deductScore = $(task.id+' .task-target.failure').length;
					}
					currentScore -= deductScore;
				}
				break;
			case 'coloring':
			case 'static':
			case 'story':
			default:
				break;
		}
		$(task.id+' .task-score').first().attr('data-score', currentScore);
		$(task.id+' .task-result-partial').html(currentScore);
	}
}
function taskShowResults(results) {
	var totalScore = 0;
	$(results+' .task-result-breakdown .task-result').each(function() {
		$(this).children('.task-result-field').html($('#'+$(this).attr('data-task')+' .task-score').first().attr('data-score'));
		totalScore += Number($('#'+$(this).attr('data-task')+' .task-score').first().attr('data-score'));
	});
	$(results+' .task-result-breakdown .task-result-total .task-result-field').html(totalScore);
	$(results+' .task-result-feedback-range').each(function() {
		if(totalScore >= $(this).attr('data-min') && totalScore <= $(this).attr('data-max')) {
			$(this).show(0);
		} else {
			$(this).hide(0);
		}
	});
}
