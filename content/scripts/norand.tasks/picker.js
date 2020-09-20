function pickerInitialize(task) {
	$(task.id).find('.task-target').each(function() {
		if(!$(this).hasClass('initialized')) {
			var valid = 'aáăâbcdeéfghiíîjklmnoóöőpqrsștțuúüűvwxyz'
			var setup = ($(task.id).attr('data-setup')+'').split(',');
			var except = ($(task.id).attr('data-except')+'').split(',');
			var lines = $(this).html().indexOf('<BR>') != -1 ? ($(this).html()+'').split('<BR>') : ($(this).html()+'').split('<br>');
			var formated = [];
			for(var l in lines) {
				formated[l] = '';
				var line = lines[l]+'';
				var head = 0;
				while(head < line.length) {
					var ex = false;
					var i = 0;
					var ok = false;
					var s = 0;
					var str = '';
					while(!ex && i < except.length) {
						str = except[i]+'';
						if(line.substr(head, str.length).toLowerCase() == str) {
							ex = true;
						} else {
							i++;
						}
					}
					if(!ex) {
						while(!ok && s < setup.length) {
							str = setup[s]+'';
							if(line.substr(head, str.length).toLowerCase() == str) {
								ok = true;
							} else {
								s++;
							}
						}
						if(ok) {
							formated[l] += '<i>'+line.substr(head, str.length)+'</i>';
							head += str.length;
						} else {
							if(valid.indexOf(line.charAt(head).toLowerCase()) != -1) {
								formated[l] += '<u>'+line.charAt(head)+'</u>';
							} else {
								formated[l] += '<b>'+line.charAt(head)+'</b>';
							}
							head += 1;
						}
					} else {
						formated[l] += '<u>'+line.substr(head, str.length)+'</u>';
						head += str.length;
					}
				}
				while(formated[l].indexOf('|') != -1) {
					formated[l] = formated[l].replace('|', '&nbsp;');
				}
			}
			$(this).html(formated.join('<br>'));
		}
	});
	$(task.id).find('.task-target').children('u').click(function(e) {
		pickerClickU($(this), task);
	});
	$(task.id).find('.task-target').children('i').click(function(e) {
		pickerClickI($(this), task);
	});
}

function pickerValidate(task) {
	var success = true;
	$(task.id+' .subpage.active .task-target').children('i').each(function() {
		 success = $(this).hasClass('s') ? success : false;
	});
	pickerFeedback(success, task);
	if(success) taskPreValidate(task);
}
function pickerFeedback(success, task) {
	if(success) {
		$('#main-feedback').html($(task.id).find('#task-feedback-success').html());
		soundPlay('good');
	} else {
		$('#main-feedback').html($(task.id).find('#task-feedback-runtime').html());
	}
}
function pickerClickU(element, task) {
	if(!taskSubpageChecked()) {
		element.addClass('s');
		soundPlay('deselect');
		setTimeout(function() {
			$('.task-target').children('u').removeClass('s');
		}, 200);
	}
}
function pickerClickI(element, task) {
	if(!taskSubpageChecked()) {
		element.addClass('s');
		soundPlay('select');
		taskOptionsOn();
		pickerValidate(task);
	}
}