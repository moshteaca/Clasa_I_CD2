// JavaScript Document

function draggerInitialize(task) {
	if($(task.id).hasClass('attach')) {
		$(task.id).find('.task-answer.drag').draggable({
			start: function() { draggerAttachStart($(this), task); },
			stop: function() { draggerAttachStop($(this), task); }
		});
		$(task.id).find('.task-target.drag').draggable({
			start: function() { draggerAttachStart($(this), task); },
			stop: function() { draggerAttachStop($(this), task); }
		});
		$(task.id).find('.task-target').click(function() {
			draggerAttachRestore($(this), task);
		});
	} else {
		$(task.id).find('.task-answer.drag').draggable({
			start: function() { draggerStart($(this), task); },
			stop: function() { draggerStop($(this), task); }
		});
	}
	if($(task.id).hasClass('multigroup')) {
		$(task.id+' .task-target').click(function(e) {
			if($(this).hasClass('has-answer')) {
				draggerHouseRestore($(this).find('.task-answer.housed').last(), task);
			}
		});
	}
}

function draggerValidate(task) {
	taskPreValidate(task);

	if($(task.id).hasClass('houser')) {
		if($(task.id).hasClass('multigroup')) {
			$(task.id+' .subpage.active .task-target.house').each(function() {
				var groups = $(this).attr('data-group').split(',');
				var index = 0;
				$(this).find('.task-answer.housed').each(function() {
					$(this).addClass(groups[index] == $(this).attr('data-group') ? 'success' : 'failure');
					index++;
				});
				if($(this).has('.failure').length || ($(this).attr('data-group') != 0 && $(this).has('.task-answer.housed').length == 0)) {
					$(this).addClass('failure');
				} else {
					$(this).addClass('success');
				}
			});
		} else {
			$(task.id+' .subpage.active .task-target.house').each(function() {
				var group = $(this).attr('data-group');
				$(this).find('.task-answer.housed').each(function() {
					$(this).addClass($(this).attr('data-group') == group ? 'success' : 'failure');
				});
				if($(this).has('.failure').length || ($(this).attr('data-group') != 0 && $(this).has('.task-answer.housed').length == 0)) {
					$(this).addClass('failure');
				} else {
					$(this).addClass('success');
				}
			});
		}
		if($(task.id).has('.task-target-group').length) {
			$(task.id+' .task-target-group').each(function() {
				if($(this).has('.failure').length) {
					$(this).addClass('failure');
				} else {
					$(this).addClass('success');
				}
			});
		}
		$(task.id+' .subpage.active .task-answer').each(function() {
			if(!$(this).hasClass('disabled') && !$(this).hasClass('housed')) {
				var group = $(this).attr('data-group');
				if(group == 0) {
					$(this).addClass('success');
				} else if(group != Math.abs(group)){
					var success = false;
					$(task.id+' .subpage.active .task-answer.housed.success').each(function() {
						success = $(this).attr('data-group') == group ? true : success;
					});
					$(this).addClass(success ? 'success' : 'failure');
				} else {
					$(this).addClass('failure');
				}
			}
			if($(this).hasClass('drag') && !$(this).hasClass('housed')) $(this).draggable('disable');
		});
	} else if($(task.id).hasClass('attach')) {
		$(task.id+' .subpage.active .task-target').each(function() {
			var group = $(this).attr('data-group');
			$(this).find('.task-answer.attached').each(function() {
				$(this).addClass($(this).attr('data-group') == group ? 'success' : 'failure');
			});
			if($(this).has('.failure').length || ($(this).attr('data-group') != 0 && $(this).has('.task-answer.attached').length == 0)) {
				$(this).addClass('failure');
			} else {
				$(this).addClass('success');
			}
			if($(this).hasClass('drag')) $(this).draggable('disable');
		});
		$(task.id+' .subpage.active .task-answer').each(function() {
			if(!$(this).hasClass('attached')) {
				$(this).addClass($(this).attr('data-group') == 0 ? 'success' : 'failure');
				if($(this).hasClass('drag')) $(this).draggable('disable');
			}
		});
	} else {
		$('.subpage.active .drag').draggable('disable');
	}

	$('.subpage.active .task-extra').each(function() {
		var success = true;
		if($(this).hasClass('question')) {
			$(this).find('.task-answer').each(function() {
				$(this).removeClass('failure');
				$(this).removeClass('success');
				success = ($(this).hasClass('p1') && !$(this).hasClass('s')) || ($(this).hasClass('p0') && $(this).hasClass('s')) ? false : success;
			});
		}
		$(this).addClass(success ? 'success' : 'failure');
	});

	draggerFeedback(task);
	taskPostValidate(task);
}
function draggerFeedback(task) {
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
			if($(task.id).hasClass('runtime')) {
				$('#main-feedback').html($(task.id).find('#task-feedback-runtime').html());
			}
			if($(task.id).hasClass('dropper')) {
				if($(task.id).hasClass('instant')) {
					var ready = true;
					$('.subpage.active .task-answer').each(function() {
						ready = $(this).hasClass('ui-draggable') && !$(this).hasClass('out') && $(this).attr('data-group') != 0 ? false : ready;
					});
					if(ready) {
						soundPlay('good');
						$('#main-feedback').html($(task.id).find('#task-feedback-success').html());
					}
				}
			}
		}
	}
}

function draggerCheck(task) {
	if($(task.id).hasClass('instant')) {
		var success = true;
		$('.subpage.active .task-target').each(function() {
			var group = $(this).attr('data-group');
			$('.subpage.active .task-answer').each(function() {
				if($(this).attr('data-group') == group) {
					success = $(this).hasClass('out') ? success : false;
				}
			});
		});
		if(success) {
			//console.log('done');
			draggerValidate(task);
		} else if($(task.id).hasClass('runtime')) {
			draggerFeedback(task);
		} else {
			taskReady(true);
		}
	} else {
	}
}

function draggerStart(answer, task) {
	$(task.id).attr('data-drags', Number($(task.id).attr('data-drags'))+1);
	if(!answer.attr('data-start').length) {
		answer.attr('data-start', answer.css('left')+','+answer.css('top'));
	}
	answer.css('z-index', $(task.id).attr('data-drags'));
}
function draggerAttachStart(element, task) {
	$(task.id).attr('data-drags', Number($(task.id).attr('data-drags'))+1);
	if(!element.attr('data-start').length) {
		element.attr('data-start', element.css('left')+','+element.css('top'));
	}
	element.css('z-index', $(task.id).attr('data-drags'));
}
function draggerAttachStop(element, task) {
	if(element.hasClass('task-target')) {
		$(task.id+' .subpage.active .task-answer').each(function() {
			if(!$(this).parents('.task-extra').length) {
				if(draggerAttachMatch($(this), element, task)) {
					draggerAttach($(this), element, task);
				} else {
					draggerAttachReset(element, task);
				}
			}
		});
	} else if(element.hasClass('task-answer')) {
		$(task.id+' .subpage.active .task-target').each(function() {
			if(!$(this).parents('.task-extra').length) {
				if(draggerAttachMatch(element, $(this), task)) {
					draggerAttach(element, $(this), task);
				} else {
					draggerAttachReset(element, task);
				}
			}
		});
	}
}
function draggerAttachMatch(answer, target, task) {
	var tRect = {
		w: target.children('.hitbox').innerWidth(),
		h: target.children('.hitbox').innerHeight(),
		x: target.children('.hitbox').offset().left,
		y: target.children('.hitbox').offset().top
	};
	var aRect = {
		w: answer.children('.hitbox').innerWidth(),
		h: answer.children('.hitbox').innerHeight(),
		x: answer.children('.hitbox').offset().left,
		y: answer.children('.hitbox').offset().top
	}
	var Dx = (tRect.x+tRect.w*0.5)-(aRect.x+aRect.w*0.5);
	var Dy = (tRect.y+tRect.h*0.5)-(aRect.y+aRect.h*0.5);
	var distance = Math.sqrt(Dx*Dx+Dy*Dy);
	if((($(task.id).hasClass('single') || target.hasClass('single')) && target.has('.task-answer.attached').length > 0) || answer.hasClass('attached')) {
		return false;
	} else {
		if($(task.id).hasClass('instant')) {
			return (distance < target.attr('data-radius') && answer.attr('data-group') == target.attr('data-group'));
		} else {
			return (distance < target.attr('data-radius'));
		}
	}
}
function draggerAttach(answer, target, task) {
	target.addClass('locked');
	if(target.hasClass('drag')) target.draggable('disable');
	target.find('.task-zone').append('<div class="task-answer attached" id="'+answer.attr('id')+'-attached" data-class="'+answer.attr('class')+'" data-id="'+answer.attr('id')+'" data-group="'+answer.attr('data-group')+'" data-start="'+answer.attr('data-start')+'" data-style="'+answer.attr('style')+'">'+answer.html()+'</div>');
	draggerAttachCheck(answer, target, task);
	answer.remove();
	soundPlay('select');
}
function draggerAttachRestore(target, task) {
	if(!taskSubpageChecked()) {
		if(target.children('.task-zone').has('.task-answer').length) {
			var answer = target.find('.task-answer.attached').first();
			$(task.id+' .subpage.active .task-playground').append('<div class="'+answer.attr('data-class')+'" id="'+answer.attr('data-id')+'" data-group="'+answer.attr('data-group')+'" data-start="'+answer.attr('data-start')+'" style="'+answer.attr('data-style')+'">'+answer.html()+'</div>');
			$('#'+answer.attr('data-id')).each(function() {
				$(this).removeClass('ui-draggable-dragging');
				$(this).draggable({
					start: function() { draggerAttachStart($(this), task); },
					stop: function() { draggerAttachStop($(this), task); }
				});
			});
			answer.remove();
			target.removeClass('locked');
			if(target.hasClass('drag')) target.draggable('enable');
			soundPlay('deselect');
		}
	}
}
function draggerAttachReset(element, task) {
}
function draggerAttachCheck(answer, target, task) {
	if($(task.id+' .subpage.active .task-answer.attached').length) {
		taskReady(true);
	}
}

function draggerStop(answer, task) {
	if($(task.id).hasClass('dropper')) {
		if($(task.id).hasClass('instant')) {
			var resetAnswer = $(task.id).hasClass('reset-answer');
			$(task.id+' .subpage.active .task-target').each(function() {
				if(draggerInstantMatch(answer, $(this), task)) {
					draggerDrop(answer, task);
					resetAnswer = false;
				} else {
					draggerReset(answer, task);
				}
			});
			if(resetAnswer) {
				answer.animate({
					top: '0px',
					left: '0px'
				});
			}
			draggerCheck(task);
			//draggerFeedback(task);
		}
	} else if($(task.id).hasClass('houser')) {
		if($(task.id).hasClass('instant')) {
			var onHouse = '';
			$(task.id+' .subpage.active .house.c').each(function() {
				if(draggerHouseMatch(answer, $(this), task) && $(this).attr('data-group') == answer.attr('data-group')) {
					onHouse = $(this).attr('id');
				}
			});
			if(onHouse.length) {
				draggerHouse(answer, $('#'+onHouse), task);
				if($(task.id).hasClass('linear')) {
					var found = false;
					for(var i = 1; i <= $(task.id+' .subpage.active .house').length; i++) {
						var house = $('#task-target-'+(i < 10 ? '0' : '')+i);
						if(found) {
							found = false;
							house.addClass('c');
						} else if(house.hasClass('c')) {
							found = true;
							house.removeClass('c');
						}
					}
				}
			} else {
				draggerReset(answer, task);
			}
		} else {
			var onHouse = '';
			var canHouse = true;
			$(task.id+' .subpage.active .house').each(function() {
				onHouse = draggerHouseMatch(answer, $(this), task) ? $(this).attr('id') : onHouse;
			});
			if($('#'+onHouse).attr('data-max')) {
				canHouse = $('#'+onHouse+' .task-answer.housed').length < $('#'+onHouse).attr('data-max');
			}
			if(onHouse.length && canHouse) {
				draggerHouse(answer, $('#'+onHouse), task);
			} else {
				draggerReset(answer, task);
			}
		}
	}
}
function draggerReset(answer, task) {
	if($(task.id).hasClass('dropper')) {
		answer.dequeue();
		answer.animate({
			left: answer.attr('data-start').split(',')[0],
			top: answer.attr('data-start').split(',')[1]
		}, {duration: 250});
	} else if($(task.id).hasClass('houser')) {
		answer.dequeue();
		answer.animate({
			left: 0,
			top: 0
		}, {duration: 250});
	}
}
function draggerInstantMatch(answer, target, task) {
	//console.log(target);
	var tRect = {
		w: target.innerWidth(),
		h: target.innerHeight(),
		x: target.offset().left,
		y: target.offset().top
	};
	var aRect = {
		w: answer.innerWidth(),
		h: answer.innerHeight(),
		x: answer.offset().left,
		y: answer.offset().top
	}
	var Dx = (tRect.x+tRect.w*0.5)-(aRect.x+aRect.w*0.5);
	var Dy = (tRect.y+tRect.h*0.5)-(aRect.y+aRect.h*0.5);
	var distance = Math.sqrt(Dx*Dx+Dy*Dy);
	return (distance < target.attr('data-radius') && answer.attr('data-group') == target.attr('data-group'));
}

function draggerDrop(answer, task) {
	var aLeft = Number(answer.css('left'))+Number(answer.innerWidth/2);
	var aTop = answer.css('top')+Number(answer.innerHeight/2);
	answer.addClass('out');
	answer.dequeue();
	answer.animate({left: aLeft, top: aTop}, {duration: 500});
	answer.hide(500);
	soundPlay('select');
}
function draggerLetGo(answer, task) {
	answer.dequeue();
	answer.animate({left: 0, top: 0}, {duration: 500});
	soundPlay('deselect');
}
function draggerHouseFeedback(task) {
	var success = true;
	$(task.id+' .subpage.active .house').each(function() {
		if($(this).has('.task-answer.housed').length == 0 && $(this).attr('data-group') > 0) {
			success = $(task.id+' .subpage.active .task-answer[data-group='+$(this).attr('data-group')+']').length > 0 ? false : success;
		} else {
			success = success;
		}
	});
	if(success) {
		taskPreValidate(task);
		soundPlay('good');
		$('#main-feedback').html($(task.id).find('#task-feedback-success').html());
		$(task.id+' .subpage.active').removeClass('not-checked');
		$(task.id+' .subpage.active').addClass('checked');
	} else {
		$('#main-feedback').html($(task.id).find('#task-feedback-runtime').html());
	}
}
function draggerHouseMatch(answer, house, task) {
	var hRect = {
		w: house.innerWidth(),
		h: house.innerHeight(),
		x: house.offset().left,
		y: house.offset().top
	};
	var aRect = {
		w: answer.innerWidth(),
		h: answer.innerHeight(),
		x: answer.offset().left,
		y: answer.offset().top
	}
	var Cx = aRect.x+aRect.w*0.5;
	var Cy = aRect.y+aRect.h*0.5;
	if(($(task.id).hasClass('single') || house.hasClass('single')) && house.has('.task-answer.housed').length > 0) {
		return false;
	} else {
		return (Cx >= hRect.x && Cx <= hRect.x+hRect.w && Cy >= hRect.y && Cy <= hRect.y+hRect.h);
	}
}
function draggerHouseRestore(answer, task) {
	if(!taskSubpageChecked()) {
		if($(task.id).hasClass('adaptive')) {
			var house = answer.parent().parent();
			var group = answer.attr('data-group');
			var m = 0;
			var matchIDs = house.attr('data-match').split(',');
			var matchGroup = false;
			for(m = 0; m < matchIDs.length; m++) {
				matchGroup = $('#'+matchIDs[m]).find('.task-answer.housed').first().attr('data-group') == house.attr('data-group') ? true : matchGroup;
			}
			if(!matchGroup) {
				var newGroup = -1;
				for(m = 0; m < matchIDs.length; m++) {
					if($('#'+matchIDs[m]+' .task-answer.housed').length > 0 && newGroup == -1) {
						newGroup = $('#'+matchIDs[m]+' .task-answer.housed').first().attr('data-group');
					}
				}
				for(m = 0; m < matchIDs.length; m++) {
					house.attr('data-group', newGroup);
					$('#'+matchIDs[m]).attr('data-group', newGroup);
				}
			}
		}
		var valid = true;
		if($(task.id).hasClass('linear')) {
			var eol = '';
			valid = false;
			for(var i = $(task.id+' .subpage.active .house').length; i >= 1; i--) {
				var house = $('#task-target-'+(i < 10 ? '0' : '') + i);
				if(house.has('.task-answer.housed').length > 0 && eol == '') {
					eol = 'task-target-'+(i < 10 ? '0' : '') + i;
				}
			}
			if(answer.parents('.task-target').attr('id') == eol) {
				$(task.id+' .subpage.active .house.c').removeClass('c');
				answer.parents('.task-target').addClass('c');
				valid = true;
			}
		}
		if(valid) {
			var house = answer.parent().parent();
			$('#'+answer.attr('data-id')).removeClass('disabled');
			$('#'+answer.attr('data-id')).draggable('enable');
			$('#'+answer.attr('data-id')).css({
				top: '0px',
				left: '0px'
			});
			answer.remove();
			soundPlay('deselect');
		}
		if(house.has('.task-answer.housed').length == 0) {
			house.removeClass('has-answer');
		} else {
			house.addClass('has-answer');
		}
	}
}
function draggerHouseCheck(answer, house, task) {
	if($(task.id).hasClass('instant')) {
		draggerHouseFeedback(task);
	} else {
		if($(task.id+' .subpage.active').has('.task-answer.housed').length) {
			taskOptionsOn();
			taskReady(true);
		} else {
			taskOptionsOff();
			taskReady(false);
		}
	}
}
function draggerHouse(answer, house, task) {
	if($(task.id).hasClass('adaptive')) {
		var m = 0;
		var matchIDs = house.attr('data-match').split(',');
		var matchHoused = false;
		var matchGroup = false;
		for(m = 0; m < matchIDs.length; m++) {
			matchHoused = $('#'+matchIDs[m]+' .task-answer.housed').length > 0 ? true : matchHoused;
			if($('#'+matchIDs[m]+' .task-answer.housed').length > 0) {
				matchHoused = true;
				if($('#'+matchIDs[m]+' .task-answer.housed').first().attr('data-group') == house.attr('data-group')) {
					matchGroup = true;
				}
			}
		}
		if(!matchHoused) {
			house.attr('data-group', answer.attr('data-group'));
			for(m = 0; m < matchIDs.length; m++) {
				$('#'+matchIDs[m]).attr('data-group', answer.attr('data-group'));
			}
		} else if(!matchGroup) {
			var newGroup = -1;
			for(m = 0; m < matchIDs.length; m++) {
				if($('#'+matchIDs[m]+' .task-answer.housed').length > 0 && newGroup == -1) {
					newGroup = $('#'+matchIDs[m]+' .task-answer.housed').first().attr('data-group');
				}
			}
			for(m = 0; m < matchIDs.length; m++) {
				house.attr('data-group') = newGroup;
				$('#'+matchIDs[m]).attr('data-group', newGroup);
			}
		}
	}
	house.find('.task-zone').append('<div class="'+answer.attr('class')+' housed" id="'+answer.attr('id')+'-housed" data-class="'+answer.attr('class')+'" data-id="'+answer.attr('id')+'" data-group="'+answer.attr('data-group')+'" data-start="'+answer.attr('data-start')+'">'+answer.html()+'</div>');
	if(!$(task.id).hasClass('multigroup')) {
		house.find('.task-zone').find('#'+answer.attr('id')+'-housed').click(function(e) {
			draggerHouseRestore($(this), task);
		});
	}
	soundPlay('select');
	answer.addClass('disabled');
	answer.draggable('disable');
	draggerHouseCheck(answer, house, task);
	if(house.has('.task-answer.housed').length == 0) {
		house.removeClass('has-answer');
	} else {
		house.addClass('has-answer');
	}
}
