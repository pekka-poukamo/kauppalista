$(document).ready(function() {

	var itemTemplate = $('#item_template').html();

	$.getJSON('/items').done(function(items) {
		$.each(items, function(i, item) {
			$('#items').append(Mustache.render(itemTemplate, item));
		});
	});

	var socket = io.connect('/');

	$('form').submit(function() {
		socket.emit('item_create', $('#m').val());
		$('#m').val('');
		return false;
	});

	$('#items').on('click', '.item button', function() {
		console.log($(this).attr('item_id'));
		socket.emit('item_delete', $(this).attr('item_id'));
	});

	socket.on('item_create', function(item) {
		$('#items').append(Mustache.render(itemTemplate, item));
	});

	socket.on('item_delete', function(itemId) {
		console.log('Delete item ' + itemId);
		$('#' + itemId).remove();
	});

});