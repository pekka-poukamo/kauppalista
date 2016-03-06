// Library for sortable lists https://github.com/RubaXa/Sortable

$(document).ready(function() {

	var itemTemplate = $('#item_template').html();
	var socket = io.connect('/');

	$.getJSON('/items').done(function(items) {
		var checked = [];
		$.each(items, function(i, item) {
			if (item.checked) {
				checked.push(item);
			} else {
				$('#items').append(Mustache.render(itemTemplate, item));
			}
		});

		checked.reverse();

		$.each(checked, function(i, item) {
			$('#checked').append(Mustache.render(itemTemplate, item));
			$('#' + item._id + ' input[type="checkbox"]').prop('checked', true);
		});

		makeSortable('items');
		makeSortable('checked');
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
		socket.emit('item_checked', {
			id: $item.attr('id'),
			checked: $(this).prop('checked')
		});
		switchList($item);
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
		switchList($item.closest('li'));
	});

	socket.on('item_delete', function(itemId) {
		$('#' + itemId).remove();
	});

	socket.on('order_changed', function (newOrder) {
		console.log('New order!');
		sortList(newOrder.listId, newOrder.order);
	});

	var itemList = function(checked) {
		if (checked) {return '#checked';} else {return '#items';}
	};

	var switchList = function($item) {
		var checked = $($item).find('input[type="checkbox"]').prop('checked');
		if (checked) {
			$item.prependTo('#checked');
		} else {
			$item.appendTo('#items');
		}
	};

	var makeSortable = function(id) {
		var el = document.getElementById(id);
		Sortable.create(el, {
			handle: '.handle',
			animation: 150,

			onSort: function(e) {
				$list = $(e.target);

				$list.children('li').each(function(i, child) {
					$(child).attr('index', $(child).index());
				});

				socket.emit('order_changed', {
					listId: $list.attr('id'),
					order: getListOrder($list)
				});

				// sortList($list, getListOrder($list));
			}
		});
	};

	var getListOrder = function($list) {
		var array = [];
		$list.children('li').each(function(i, child) {
			array.push({
				id: $(child).attr('id'),
				index: $(child).index()
			});
		});

		return array;
	};

	var sortList = function(listId, order) {

		var $list = $('#' + listId);

		for (var i = order.length - 1; i >= 0; i--) {
			var item = order[i];
			// console.log($list.children('[id='+item.id+']').attr('index') + ', ' + item.index);
			// console.log($list.children('[id='+item.id+']').attr('index') == item.index);
			$list.children('[id='+item.id+']').attr('index', item.index);
		}

		console.log($list.children('li'));
		console.log($list.children('li').sort(sort_li));
		$list.children('li').sort(sort_li) // sort elements
                  .appendTo($list); // append again to the list

		// sort function callback
		function sort_li(a, b){
		    return ($(b).attr('index')) < ($(a).attr('index')) ? 1 : -1;
		}
	};

});