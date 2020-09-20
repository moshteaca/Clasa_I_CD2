// JavaScript Document

function matchInitialize(task) {
	$(task.id).find('.task-answer').click(function(e) {
		matchClickAnswer($(this), task);
	});
	$(task.id).find('.task-target').click(function(e) {
		matchClickTarget($(this), task);
	});
}
function matchValidate(task) {
	taskPreValidate(task);

	var success = true;
	if($(task.id).hasClass('dasher')) {
		$(task.id+' .subpage.active .task-target').each(function() {
			var setupTarget = $(this).attr('data-setup').split(',');
			var answerTargetH = $(this).attr('data-answer-h').split(',');
			var answerTargetV = $(this).attr('data-answer-v').split(',');
			if(answerTargetH[0] != 'x' && answerTargetH[1] != 'y') {
				if($(this).has('.h').length == 0) {
					success = false;
					$(this).append('<div class="h c" style="width: '+((answerTargetH[1]-setupTarget[1])*$(this).outerWidth(true)-20)+'px;"></div>');
				}
			}
			if(answerTargetV[0] != 'x' && answerTargetV[1] != 'y') {
				if($(this).has('.v').length == 0) {
					success = false;
					$(this).append('<div class="v c" style="height: '+((answerTargetV[0]-setupTarget[0])*$(this).outerHeight(true)-20)+'px;"></div>');
				}
			}
			$(this).addClass(success ? 'success' : 'failure');
		});
	} else if($(task.id).hasClass('arrow')) {
		$(task.id+' .subpage.active .task-target').each(function() {
		});
	} else {
		$(task.id+' .subpage.active .task-target').each(function() {
			if($(this).find('.mark').length) {
				if($(this).attr('data-group') == 0) {
					success = false;
				} else {
					success = $(this).attr('data-group') == $('#'+$(this).attr('data-answer')).attr('data-group');
					if(!success) {
						matchMake($(this), $(task.id+' .subpage.active .task-answer[data-group='+$(this).attr('data-group')+']').first(), task);
					} else {
					}
				}
			} else {
				success = $(this).attr('data-group') == 0;
				if(!success) {
					matchMake($(this), $(task.id+' .subpage.active .task-answer[data-group='+$(this).attr('data-group')+']').first(), task);
				} else {
				}
			}
			$(this).addClass(success ? 'success' : 'failure');
		});
		if($(task.id).hasClass('color')) {
			if($(task.id).hasClass('instant')) {
				$(task.id+' .subpage.active .task-target').each(function(index, element) {
					$(this).addClass('.success');
				});
			} else {
				$(task.id+' .subpage.active .task-target').each(function(index, element) {
					var q = $(task.id).hasClass('queue');
					var thisAnswer = $('#'+$(this).attr('data-answer'));
					if($(this).attr('data-group') != 0) {
						thisModel = {
							x: $(this).offset().left,
							y: $(this).offset().top,
							w: $(this).outerWidth(false),
							h: $(this).outerHeight(false)
						}
						answerModel = {
							x: thisAnswer.offset().left,
							y: thisAnswer.offset().top,
							w: thisAnswer.outerWidth(false),
							h: thisAnswer.outerHeight(false)
						}
						targetModel = {
							x: 0,
							y: 0
						}
						if($(task.id).has('.horizontal').length) {
							if(thisModel.y < answerModel.y) {
								targetModel.x = (answerModel.x + answerModel.w*0.5 - thisModel.w*0.5)-thisModel.x;
								targetModel.y = (answerModel.y - thisModel.h - 10 + (q ? thisAnswer.attr('data-queue') : 0))-thisModel.y;
							} else {
								targetModel.x = (answerModel.x + answerModel.w*0.5 - thisModel.w*0.5)-thisModel.x;
								targetModel.y = (answerModel.y + answerModel.h + 10 - (q ? thisAnswer.attr('data-queue') : 0))-thisModel.y;
							}
							if(q) { thisAnswer.attr('data-queue', Number(Number(thisAnswer.attr('data-queue')) - answerModel.h)); }
						} else if($(task.id).has('.vertical').length) {
							if(thisModel.x < answerModel.x) {
								targetModel.x = (answerModel.x - thisModel.w - 10 + (q ? thisAnswer.attr('data-queue') : 0))-thisModel.x;
								targetModel.y = (answerModel.y + answerModel.h*0.5 - thisModel.h*0.5)-thisModel.y;
							} else {
								targetModel.x = (answerModel.x + answerModel.w + 10 - (q ? thisAnswer.attr('data-queue') : 0)) - thisModel.x;
								targetModel.y = (answerModel.y + answerModel.h*0.5 - thisModel.h*0.5)-thisModel.y
							}
							if(q) { thisAnswer.attr('data-queue', Number(Number(thisAnswer.attr('data-queue')) - answerModel.w)); }
						}
						$(this).dequeue();
						$(this).animate({left: targetModel.x, top: targetModel.y}, 250, 'linear');
					}
				});
			}
		}
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
	matchFeedback(task);
	taskPostValidate(task);
}
function matchFeedback(task) {
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
		}
	}
}
function matchCheck(task) {
	if($(task.id).hasClass('dasher')) {
		if($(task.id).has('.task-target .h').length > 0 || $(task.id).has('.task-target .v').length > 0) {
			taskOptionsOn();
			taskReady(true);
		} else {
			taskOptionsOff();
			taskReady(false);
		}
	} else if($(task.id).hasClass('arrow')) {
		if($(task.id).hasClass('linear')) {
			if($(task.id).hasClass('instant')) {
				if($(task.id).attr('data-step') == $(task.id+' .subpage.active .task-target').length) matchValidate(task);
			}
		}
	} else {
		if($(task.id).hasClass('instant')) {
			var complete = true;
			$('.subpage.active .task-target').each(function() {
				complete = (!$(this).hasClass('matched') && $(this).attr('data-group') != 0) ? false : complete;
			});
			$('.subpage.active .task-answer').each(function() {
				complete = (!$(this).hasClass('matched') && $(this).attr('data-group') != 0) ? false : complete;
			});
			if(complete) {
				taskPreValidate(task);
				matchFeedback(task);
			} else {
			}
		} else {
			if($(task.id).has('.task-marks .mark').length) {
				taskOptionsOn();
				taskReady(true);
			} else {
				taskOptionsOff();
				taskReady(false);
			}
		}
	}
}
function matchClickAnswer(answer, task) {
	if(!taskSubpageChecked()) {
		if($(task.id).hasClass('single')) {
			if(!answer.parent().hasClass('task-extra')) {
				matchMake($(task.id+ ' .subpage.active .task-target.s').first(), answer, task);
			}
		} else {
			if(answer.parents('.task-question').hasClass('armed')) {
				matchMake($(task.id+ ' .subpage.active .task-target.s').first(), answer, task);
				answer.parents('.task-question').removeClass('armed');
			}
		}
	}
}
function matchClickTarget(target, task) {
	if($(task.id).hasClass('arrow')) {
		// arrow
		if($(task.id).hasClass('linear')) {
			// linear
			if($(task.id).hasClass('instant')) {
				// instant
				if(!taskSubpageChecked()) {
					if($(task.id).attr('data-step') == target.attr('data-group') - 1) {
						matchMake($(task.id+' .subpage.active .task-target[data-group='+$(task.id).attr('data-step')+']'), target, task);
						$(task.id).attr('data-step', target.attr('data-group'));
						matchCheck(task);
						soundPlay('select');
					} else {
						soundPlay('deselect');
					}
				}
			} else {
				// not instant
			}
		} else {
			// not linear
		}
	} else if($(task.id).hasClass('dasher')) {
		if(!taskSubpageChecked()) {
			if($(task.id).hasClass('selecting')) {
				if(target.hasClass('s')) {
					$(task.id).removeClass('selecting');
					$(task.id+' .subpage.active .task-target.s').removeClass('s');
					$(task.id+' .subpage.active .task-target.a').removeClass('a');
					soundPlay('deselect');
				} else {
					if(target.hasClass('a')) {
						var setupThis = target.attr('data-setup').split(',');
						var setupTarget = $('.task-target.s').attr('data-setup').split(',');
						var answerTargetH = $('.task-target.s').attr('data-answer-h').split(',');
						var answerTargetV = $('.task-target.s').attr('data-answer-v').split(',');
						if(setupThis[0] == setupTarget[0]) {
							if(setupThis[1] == answerTargetH[1]) {
								$('.task-target.s').append('<div class="h" style="width: '+((setupThis[1]-setupTarget[1])*target.outerWidth(true)-20)+'px;"></div>');
							} else {
								$('.task-target.s').append('<div class="wh" style="width: '+((setupThis[1]-setupTarget[1])*target.outerWidth(true)-20)+'px;"></div>');
								setTimeout(function() {
									$('.task-target .wh').remove();
								}, 250);
							}
						}
						if(setupThis[1] == setupTarget[1]) {
							if(setupThis[0] == answerTargetV[0]) {
								$('.task-target.s').append('<div class="v" style="height: '+((setupThis[0]-setupTarget[0])*target.outerHeight(true)-20)+'px;"></div>');
							} else {
								$('.task-target.s').append('<div class="wv" style="height: '+((setupThis[0]-setupTarget[0])*target.outerHeight(true)-20)+'px;"></div>');
								setTimeout(function() {
									$('.task-target .wv').remove();
								}, 250);
							}
						}
						matchCheck(task);
						soundPlay('select');
						
						$(task.id).removeClass('selecting');
						$(task.id+' .subpage.active .task-target.s').removeClass('s');
						$(task.id+' .subpage.active .task-target.a').removeClass('a');
					} else {
						$(task.id+' .subpage.active .task-target.s').removeClass('s');
						$(task.id+' .subpage.active .task-target.a').removeClass('a');
						target.addClass('s');
						$(task.id+' .subpage.active .task-target').each(function() {
							var setupThis = $(this).attr('data-setup').split(',');
							var setupTarget = $('.task-target.s').attr('data-setup').split(',');
							if((Number(setupThis[0]) == Number(setupTarget[0]) && Number(setupThis[1]) > Number(setupTarget[1]))) {
								if($('.task-target.s').has('.h').length == 0) {
									$(this).addClass('a');
								} else {
								}
							}
							if((Number(setupThis[0]) > Number(setupTarget[0]) && Number(setupThis[1]) == Number(setupTarget[1]))) {
								if($('.task-target.s').has('.v').length == 0) {
									$(this).addClass('a');
								} else {
								}
							}
						});
					}
				}
			} else {
				$(task.id).addClass('selecting');
				target.addClass('s');
				soundPlay('select');
				$(task.id+' .subpage.active .task-target').each(function() {
					var setupThis = $(this).attr('data-setup').split(',');
					var setupTarget = $('.task-target.s').attr('data-setup').split(',');
					if((Number(setupThis[0]) == Number(setupTarget[0]) && Number(setupThis[1]) > Number(setupTarget[1]))) {
						if($('.task-target.s').has('.h').length == 0) {
							$(this).addClass('a');
						} else {
						}
					}
					if((Number(setupThis[0]) > Number(setupTarget[0]) && Number(setupThis[1]) == Number(setupTarget[1]))) {
						if($('.task-target.s').has('.v').length == 0) {
							$(this).addClass('a');
						} else {
						}
					}
				});
			}
		}
	} else {
		if(!taskSubpageChecked()) {
			if($(task.id).hasClass('single')) {
				var sel = target.find('.mark').length;
				if(sel == 0) {
					target.addClass('s');
					matchClickAnswer($(task.id+' .subpage.active .task-answer').first(), task);
					target.removeClass('s');
					soundPlay('select');
				} else {
					target.attr('data-answer', '');
					target.find('.task-marks').html('');
					if(target.hasClass('icon')) {
						target.find('.disc').css('border-color', '');
						target.find('.disc').css('background-color', '#FFFFFF');
						soundPlay('select');
					} else {
						target.css('border-color', '');
						target.css('background-color', '');
						soundPlay('deselect');
					}
					matchCheck(task);
				}
			} else {
				if($(task.id).hasClass('instant')) {
					if(!target.hasClass('matched')) {
						$(task.id+' .subpage.active .task-target').each(function() {
							$(this).removeClass('s');
						});
						target.addClass('s');

						if($(task.id+' .subpage.active .task-target.s').length) {
							$('.task-target.s').parents('.task-question').addClass('armed');
						} else {
							$('.task-target.s').parents('.task-question').removeClass('armed');
						}
					}
				} else {
					var sel = target.hasClass('s');
					$(task.id+' .subpage.active .task-target').each(function() {
						$(this).removeClass('s');
					});
					if(!sel) target.addClass('s');
					target.attr('data-answer', '');
					target.find('.task-marks').html('');
					if(target.hasClass('icon')) {
						target.find('.disc').css('border-color', '');
						target.find('.disc').css('background-color', '#FFFFFF');
						soundPlay('select');
					} else {
						target.css('border-color', '');
						target.css('background-color', '');
						soundPlay('deselect');
					}
					matchCheck(task);
					
					if($(task.id+' .subpage.active .task-target.s').length) {
						$('.task-target.s').parents('.task-question').addClass('armed');
					} else {
						$('.task-target.s').parents('.task-question').removeClass('armed');
					}
				}
			}
		}
	}
}
function matchMake(target, answer, task) {
	if(!taskSubpageChecked() && (!$(task.id).hasClass('linear') && !$(task.id).hasClass('single'))) {
		matchClickTarget(target, task);
	}
	if($(task.id).hasClass('liner')) {
		var aRect = {
			x: Math.round(answer.offset().left),
			y: Math.round(answer.offset().top),
			w: Math.round(answer.outerWidth(false)),
			h: Math.round(answer.outerHeight(false))
		};
		var tRect = {
			x: Math.round(target.offset().left),
			y: Math.round(target.offset().top),
			w: Math.round(target.outerWidth(false)),
			h: Math.round(target.outerHeight(false))
		};
		var markLength = 0;
		var markDx = 0;
		var markDy = 0;
		var markAngle = 0;
		var markTolerance = 5;
		var markAttach = '';
		if($(task.id+' .subpage.active .task-question').hasClass('horizontal')) {
			if(aRect.y + aRect.h*0.5 < tRect.y + tRect.h*0.5) {
				markAttach = 'below';
				markDx = (tRect.x+tRect.w*0.5)-(aRect.x+aRect.w*0.5);
				markDy = tRect.y-(aRect.y+aRect.h)+markTolerance;
				markLength = Math.ceil(Math.sqrt(Math.pow(markDx, 2)+Math.pow(markDy, 2)));
			} else {
				markAttach = 'above';
				markDx = (tRect.x+tRect.w*0.5)-(aRect.x+aRect.w*0.5);
				markDy = (tRect.y+tRect.h)-aRect.y-markTolerance;
				markLength = Math.ceil(Math.sqrt(Math.pow(markDx, 2)+Math.pow(markDy, 2)));
			}
			
		} else if($(task.id+' .subpage.active .task-question').hasClass('vertical')) {
			if(aRect.x + aRect.w*0.5 < tRect.x + tRect.w*0.5) {
				markAttach = 'beyond';
				markDx = tRect.x-(aRect.x+aRect.w)+markTolerance;
				markDy = (tRect.y+tRect.h*0.5)-(aRect.y+aRect.h*0.5);
				markLength = Math.ceil(Math.sqrt(Math.pow(markDx, 2)+Math.pow(markDy, 2)));
			} else {
				markAttach = 'ahead';
				markDx = (tRect.x+tRect.w)-aRect.x-markTolerance;
				markDy = (tRect.y+tRect.h*0.5)-(aRect.y+aRect.h*0.5);
				markLength = Math.ceil(Math.sqrt(Math.pow(markDx, 2)+Math.pow(markDy, 2)));
			}
		} else if($(task.id+' .subpage.active .task-question').hasClass('radial')) {
				markAttach = 'center';
				markDx = (tRect.x+tRect.w*0.5)-(aRect.x+aRect.w*0.5);
				markDy = (tRect.y+tRect.h*0.5)-(aRect.y+aRect.h*0.5);
				markLength = Math.ceil(Math.sqrt(Math.pow(markDx, 2)+Math.pow(markDy, 2)));
		}
		target.attr('data-answer', answer.attr('id'));
		if(!taskSubpageChecked()) {
			if(target.hasClass('icon')) {
				target.find('.disc').css('border-color', answer.css('borderTopColor'));
			} else {
				target.css('border-color', answer.css('borderTopColor'));
			}
			target.find('.task-marks').html('<div class="mark '+markAttach+'"></div>');
			target.find('.task-marks').find('.mark').each(function() {
				$(this).css('background-color', answer.css('borderTopColor'));
				$(this).css('width', markLength+'px');
				var rot = Math.atan2(-markDy, -markDx)*180/Math.PI;
				if(versionIE == 'preIE9') {
					var w = $(this).innerWidth();
					var h = $(this).innerHeight();
					var c = Math.cos(Math.PI * rot / 180);
					var s = Math.sin(Math.PI * rot / 180);
					var dx = (w - w*c - h*s)/2+'px';
					var dy = (h - h*c - w*s)/2+'px';
					$(this).css({
						filter: 'progid:DXImageTransform.Microsoft.Matrix(M11='+c+',M12='+(-s)+',M21='+s+',M22='+c+',SizingMethod="auto expand")',
					});
				} else {
					$(this).rotate({angle: rot, center: ['0%', '50%']});
				};
				
			});
		} else {
			if(target.hasClass('icon')) {
				target.find('.disc').css('border-color', '#CC0E17');
			} else {
				target.css('border-color', '#CC0E17');
			}
			target.find('.task-marks').append('<div class="mark c '+markAttach+'"></div>');
			target.find('.task-marks').find('.mark.c').each(function() {
				$(this).css('width', markLength+'px');
				var rot = Math.atan2(-markDy, -markDx)*180/Math.PI;
				if(versionIE == 'preIE9') {
					var w = $(this).innerWidth();
					var h = $(this).innerHeight();
					var c = Math.cos(Math.PI * rot / 180);
					var s = Math.sin(Math.PI * rot / 180);
					var dx = (w - w*c - h*s)/2+'px';
					var dy = (h - h*c - w*s)/2+'px';
					$(this).css({
						filter: 'progid:DXImageTransform.Microsoft.Matrix(M11='+c+',M12='+(-s)+',M21='+s+',M22='+c+',SizingMethod="auto expand")',
					});
				} else {
					$(this).rotate({angle: rot, center: ['0%', '50%']});
				};
			});
		}
	}
	if($(task.id).hasClass('arrow')) {
		var aBounds = {
			x: Math.round(answer.offset().left),
			y: Math.round(answer.offset().top),
			w: Math.round(answer.outerWidth(false)),
			h: Math.round(answer.outerHeight(false))
		};
		var tBounds = {
			x: Math.round(target.offset().left),
			y: Math.round(target.offset().top),
			w: Math.round(target.outerWidth(false)),
			h: Math.round(target.outerHeight(false))
		};
		var arrowDx = tBounds.x + tBounds.w * 0.5 - (aBounds.x + aBounds.w * 0.5);
		var arrowDy = tBounds.y + tBounds.h * 0.5 - (aBounds.y + aBounds.h * 0.5);
		var arrowLength = Math.sqrt(Math.pow(arrowDx, 2) + Math.pow(arrowDy, 2));
		var arrowAngle = Math.atan2(-arrowDy, -arrowDx)*180/Math.PI;
		target.find('.task-marks').append('<div class="mark c"><div class="task-arrow-wrapper"><div class="task-arrow"></div></div></div>');
		target.find('.task-marks').find('.mark.c').each(function() {
			$(this).css('width', arrowLength+'px');
				if(versionIE == 'preIE9') {
					var w = $(this).innerWidth();
					var h = $(this).innerHeight();
					var c = Math.cos(Math.PI * arrowAngle / 180);
					var s = Math.sin(Math.PI * arrowAngle / 180);
					var dx = (w - w*c - h*s)/2+'px';
					var dy = (h - h*c - w*s)/2+'px';
					$(this).css({
						filter: 'progid:DXImageTransform.Microsoft.Matrix(M11='+c+',M12='+(-s)+',M21='+s+',M22='+c+',SizingMethod="auto expand")',
					});
				} else {
					$(this).rotate({angle: arrowAngle, center: ['0%', '50%']});
				};
		});
	}
	if($(task.id).hasClass('color')) {
		if($(task.id).hasClass('instant')) {
			if(target.attr('data-group') == answer.attr('data-group') && target.attr('data-group') != 0 && target.attr('data-group') != 0) {
				target.removeClass('s');
				target.addClass('matched');
				answer.addClass('matched');
				soundPlay('good');
			} else {
				soundPlay('bad');
			}
		} else {
			target.attr('data-answer', answer.attr('id'));
			target.find('.task-marks').html('<div class="mark"></div>');
			if(!taskSubpageChecked()) {
				if(target.hasClass('icon')) {
					target.find('.disc').css('border-color', answer.css('borderTopColor'));
					if($(task.id).hasClass('border-bg')) {
						target.find('.disc').css('background-color', answer.css('backgroundColor'));
					}
				} else {
					target.css('border-color', answer.css('borderTopColor'));
					if($(task.id).hasClass('border-bg')) {
						target.css('background-color', answer.css('backgroundColor'));
					}
				}
			}
		}
	}
	if(!taskSubpageChecked()) {
		matchCheck(task);
	}
}
