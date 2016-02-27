$(document).ready(function() {

	var itemTemplate = $('#item_template').html();
	var socket = io.connect('/');

	$.getJSON('/items').done(function(items) {
		$.each(items, function(i, item) {
			if (item.checked) {
				$('#checked').append(Mustache.render(itemTemplate, item));
				$('#' + item._id + ' input[type="checkbox"]').prop('checked', true);
			} else {
				$('#items').append(Mustache.render(itemTemplate, item));
			}
		});
	});

	$('form').submit(function() {
		socket.emit('item_create', $('#m').val());
		$('#m').val('');
		return false;
	});

	$('#items, #checked').on('click', '.item button', function() {
		socket.emit('item_delete', $(this).attr('item_id'));
	});

	$('#items, #checked').on('keyup', '.item input', function() {
		socket.emit('item_change', {
			id: $(this).closest('li').attr('id'),
			text: $(this).val()
		});
	});

	$('#items, #checked').on('change', 'input[type="checkbox"]', function() {
		var $item = $(this).closest('li');
		console.log('no muuttuha, ' + $item.attr('id') + ', ' + $(this).prop('checked'));

		socket.emit('item_checked', {
			id: $item.attr('id'),
			checked: $(this).prop('checked')
		});
		$item.prependTo($(itemList($(this).prop('checked'))));
	});

	socket.on('item_create', function(item) {
		$('#items').append(Mustache.render(itemTemplate, item));
	});

	socket.on('item_change', function(item) {
		$('#' + item.id + ' input[type="text"]').val(item.text);
	});

	socket.on('item_checked', function(item) {
		var $item = $('#' + item.id + ' input[type="checkbox"]');
		$item.prop('checked', item.checked);
		$item.closest('li').prependTo($(itemList(item.checked)));
	});

	socket.on('item_delete', function(itemId) {
		console.log('Delete item ' + itemId);
		$('#' + itemId).remove();
	});

	var itemList = function(checked) {
		if (checked) {return '#checked';} else {return '#items';}
	};

});