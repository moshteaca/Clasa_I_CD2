// JavaScript Document

// sound function
var soundPlaying;
function soundInitialize() {
	soundPlaying = '';
	soundActivateInstruction();
	soundActivateElements();
}
function soundActivateInstruction() {
	$('.audio-task-instruction').each(function() {
		$(this).bind('ended', function() {
			//console.log('Instruction sound playback ended.');
			soundPlaying = '';
			$('.task-audio-trigger').each(function() {
				$(this).removeClass('disabled');
			});
		});
	});
	$('.task-instruction').each(function() {
		$(this).click(function() {
			var taskAudio;
			if($(this).attr('data-instruction-id')) {
				taskAudio = $(this).parents('.task').find('.audio-task-instruction#'+$(this).attr('data-instruction-id')).first().get(0);
			} else {
				taskAudio = $(this).parents('.task').find('.audio-task-instruction').first().get(0);
			}
			if(taskAudio.paused) {
				if(soundPlaying.length) {
					//console.log('Instruction sound playback suppressed by: '+soundPlaying);
				} else {
					taskAudio.play();
					soundPlaying = 'instruction';
					//console.log('Instruction sound playback started.');
					$('html').addClass('audio-playing-instruction');
					$('.task-audio-trigger').each(function() {
						$(this).addClass('disabled');
					});
				}
			} else {
				taskAudio.pause();
				taskAudio.currentTime = 0;
				//console.log('Instruction sound playback paused.');
				soundPlaying = '';
				$('html').removeClass('audio-playing-instruction');
				$('.task-audio-trigger').each(function() {
					$(this).removeClass('disabled');
				});
			}
		});
	});
}
function soundActivateElements() {
	$('.audio-task-element').each(function() {
		$(this).bind('ended', function() {
			//console.log('Element sound playback ended: '+soundPlaying);
			soundPlaying = '';
			$('.task-audio-trigger').each(function() {
				$(this).removeClass('disabled');
			});
		});
	});
	$('.task-audio-trigger').each(function() {
		$(this).click(function(e) {
			if(!$(this).parents('.task').first().hasClass('propagate')) {
				e.stopPropagation();
			} else if(soundPlaying.length) {
				e.stopPropagation();
			}
			var taskAudio = $(this).parents('.task').find('#'+$(this).attr('data-audio')).get(0);
			if(taskAudio.paused) {
				if(soundPlaying.length) {
					//console.log('Element sound playback suppressed by: '+soundPlaying);
				} else {
					taskAudio.play();
					soundPlaying = $(this).attr('data-audio');
					//console.log('Element sound playback started: '+soundPlaying);
					$('html').addClass('audio-playing-element');
					$('.task-audio-trigger').each(function() {
						if($(this).attr('data-audio') != soundPlaying) $(this).addClass('disabled');
					});
				}
			} else {
				taskAudio.pause();
				taskAudio.currentTime = 0;
				//console.log('Element sound playback paused: '+soundPlaying);
				soundPlaying = '';
				$('html').removeClass('audio-playing-element');
				$('.task-audio-trigger').each(function() {
					$(this).removeClass('disabled');
				});
			}
		});
	});
}
function soundPlay(sound) {
	if(soundEnabled) {
		switch(sound) {
			case 'page':
				$('#audio-main-ui-page').get(0).play();
				break;
			case 'select':
				$('#audio-main-ui-select').get(0).play();
				break;
			case 'deselect':
				$('#audio-main-ui-deselect').get(0).play();
				break;
			case 'good':
				$('#audio-main-ui-good').get(0).play();
				break;
			case 'bad':
				$('#audio-main-ui-bad').get(0).play();
				break;
			case 'test':
				$('#audio-main-ui-test').get(0).play();
				break;
			default:
				break;
		}
	}
}
function soundPause(sound) {
	
}
function soundStop(sound) {
	if(soundEnabled) {
		switch(sound) {
			case 'page':
				$('#audio-main-ui-page').get(0).pause();
				
				break;
			case 'select':
				$('#audio-main-ui-select').get(0).play();
				break;
			case 'deselect':
				$('#audio-main-ui-deselect').get(0).play();
				break;
			case 'good':
				$('#audio-main-ui-good').get(0).play();
				break;
			case 'bad':
				$('#audio-main-ui-bad').get(0).play();
				break;
			case 'test':
				$('#audio-main-ui-test').get(0).play();
				break;
			case 'instruction':
				if($('.audio-task-instruction').length) {
					if(soundPlaying.length) {
						//console.log('Instruction sound playback suppressed by: '+soundPlaying);
					} else {
						$('.audio-task-instruction').get(0).play();
						$('html').addClass('audio-playing-instruction');
						soundPlaying = 'instruction';
						//console.log('Instruction sound playback started: '+soundPlaying);
					}
				}
				break;
			default:
				if($('.audio-task-element#'+sound).length) {
					if(soundPlaying.length) {
						if(sound != soundPlaying) {
							//console.log('Element sound playback suppressed by: '+soundPlaying);
						} else {
							$('.audio-task-element#'+sound).get(0).pause();
							$('.audio-task-element#'+sound).get(0).currentTime = 0;
							$('html').removeClass('audio-playing-element');
							//console.log('Element sound playback paused: '+soundPlaying);
							soundPlaying = '';
						}
					} else {
						$('.audio-task-element#'+sound).get(0).play();
						$('html').addClass('audio-playing-element');
						soundPlaying = sound;
						//console.log('Element sound playback started: '+soundPlaying);
					}
				} else {
				}
				break;
		}
	}
}
function soundGlobalVolume(volume) {

}
function soundON() {
	$('#option-sound').addClass('active');
	soundEnabled = true;
	soundPlay('select');
}

function soundOFF() {
	$('#option-sound').removeClass('active');
	soundPlay('deselect');
	soundEnabled = false;
}

// video functions
function videoPlay(video) {
	
}
function videoPause(video) {
	
}
function videoStop(video) {
	
}
