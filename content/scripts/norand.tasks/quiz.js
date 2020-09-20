// JavaScript Document

function quizInitialize(task) {
	$(task.id).find('.task-target').each(function() {
		var targetSetup = ($(this).attr('data-setup')+'').split(',');
	});
	$(task.id).find('.task-answer').click(function(e) {
		quizClick($(this), task);
	});
	if($(task.id).hasClass('clicker')) {
		$(task.id).find('.task-answer.rotate').children('img').each(function() {
			var rot = Math.floor(Math.random()*12)*30;
			if(versionIE == 'preIE9') {
				var w = $(this).innerWidth();
				var h = $(this).innerHeight();
				var c = Math.cos(Math.PI * rot / 180);
				var s = Math.sin(Math.PI * rot / 180);
				var dx = (w - w*c - h*s)/2+'px';
				var dy = (h - h*c - w*s)/2+'px';
				$(this).css({
					filter: 'progid:DXImageTransform.Microsoft.Matrix(M11='+c+',M12='+(-s)+',M21='+s+',M22='+c+',SizingMethod="auto expand")',
					left: dx,
					top: dy
				});
			} else {
				$(this).rotate({angle: rot, center: ['50%', '50%']});
			};
		});
	};
}

function quizValidate(task) {
	taskPreValidate(task);
	$(task.id+' .subpage.active .task-target').each(function() {
		var success = true;
		if($(this).has('.task-answer.px').length) {
			success = $(this).has('.task-answer.s').length > 0;
		} else {
			$(this).find('.task-answer').each(function() {
				success = ($(this).hasClass('p1') && !$(this).hasClass('s')) || ($(this).hasClass('p0') && $(this).hasClass('s')) ? false : success;
			});
		}
		$(this).addClass(success ? 'success' : 'failure');
	});
	quizFeedback(task);
	taskPostValidate(task);
}
function quizFeedback(task) {
	if($(task.id).hasClass('feedback')) {
		if(taskSubpageChecked()) {
		// evaluated feedback
			if($(task.id).hasClass('feedback-final')) {
				$(task.id).attr('data-score-current', ($(task.id+' .subpage.active').has('.failure').length ? $(task.id).attr('data-score-current') : Number($(task.id).attr('data-score-current')) + Number($(task.id+' .subpage.active').attr('data-score'))));
				allChecked = true;
				$(task.id+' .subpage').each(function() {
					allChecked = $(this).hasClass('checked') ? allChecked : false;
				});
				if(allChecked) {
					if(Number($(task.id).attr('data-score-current')) < Number($(task.id).attr('data-score-needed'))) {
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
				}
			} else {
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
			}
		} else {
			// runtime feedback
			if($(task.id).hasClass('runtime')) {
				$('#main-feedback').html($(task.id).find('#task-feedback-runtime').first().html());
			}
		}
	}
}
function quizCheck(task) {
	var check = true;
	$(task.id+' .subpage.active .task-question').each(function() {
		check = $(this).has('.task-answer.s').length ? check : false;
	});
	if(check) {
		taskOptionsOn();
		if($(task.id).hasClass('instant')) {
			quizValidate(task);
		} else {
			taskReady(check);
		}
	} else {
		taskOptionsOff();
	}
}
function clickCheck(task) {
	var check = true;
	$(task.id+' .subpage.active .task-answer').each(function() {
		check = ($(this).hasClass('p1') && $(this).hasClass('s')) || $(this).hasClass('p0') ? check : false;
	});
	if(check) {
		$('#main-feedback').html('');
	}
	if(check) {
		taskOptionsOn();
		if($(task.id).hasClass('instant')) {
			quizValidate(task);
		} else {
			taskReady(check);
		}
	} else {
		taskOptionsOff();
	}
}

function quizClick(answer, task) {
	if($(task.id).hasClass('clicker')) {
		if(!taskSubpageChecked()) {
			answer.addClass('s');
			setTimeout(function() {
				$(task.id+' .subpage.active .task-answer.p1.s').each(function() {
					$(this).hide(0);
				});
				$(task.id+' .subpage.active .task-answer.p0.s').each(function() {
					$(this).removeClass('s');
				});
			}, 250);
			clickCheck(task);
			quizFeedback(task);
			soundPlay('select');
		}
	} else {
		if(!taskSubpageChecked()) {
			if(answer.hasClass('s')) {
				answer.removeClass('s');
				soundPlay('deselect');
			} else {
				if(answer.attr('data-group') != 0) {
					var group = answer.attr('data-group');
					answer.parents('.task-question').find('.task-answer').each(function() {
						if($(this).attr('data-group') == group && $(this).hasClass('s')) {
							$(this).removeClass('s');
						}
					});
				}
				answer.addClass('s');
				soundPlay('select');
			}
			quizFeedback(task);
			quizCheck(task);
		}
	}
}
