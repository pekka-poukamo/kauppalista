$(document).ready(function() {

	var itemTemplate = $('#item_template').html();
	var socket = io.connect('/');

	$.getJSON('/items').done(function(items) {
		$.each(items, function(i, item) {
			$('#items').append(Mustache.render(itemTemplate, item));
		});
	});

	$('form').submit(function() {
		socket.emit('item_create', $('#m').val());
		$('#m').val('');
		return false;
	});

	$('#items').on('click', '.item button', function() {
		socket.emit('item_delete', $(this).attr('item_id'));
	});

	$('#items').on('keyup', '.item input', function() {
		socket.emit('item_change', {
			id: $(this).closest('li').attr('id'),
			text: $(this).val()
		});
	});

	$('#items').on('change', 'input[type="checkbox"]', function() {
		console.log('no muuttuha, ' + $(this).closest('li').attr('id') + ', ' + $(this).prop('checked'));
		socket.emit('item_checked', {
			id: $(this).closest('li').attr('id'),
			checked: $(this).prop('checked')
		});
	});

	socket.on('item_create', function(item) {
		$('#items').append(Mustache.render(itemTemplate, item));
	});

	socket.on('item_change', function(item) {
		$('#' + item.id + ' input[type="text"]').val(item.text);
	});

	socket.on('item_checked', function(item) {
		$('#' + item.id + ' input[type="checkbox"]').prop('checked', item.checked);
	});

	socket.on('item_delete', function(itemId) {
		console.log('Delete item ' + itemId);
		$('#' + itemId).remove();
	});

});