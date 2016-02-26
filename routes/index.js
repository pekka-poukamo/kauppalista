

module.exports = function(io) {

	var express = require('express');
	var router = express.Router();

	var Item = require('../models/item');

	/* GET home page. */
	router.get('/', function(req, res, next) {

		res.render('index');

	});

	io.on('connection', (socket) => {
	  console.log('a user connected');

	  socket.on('disconnect', () => {
	    console.log('user disconnected');
	  });

	  socket.on('item_create', (itemText) => {

	  	var newItem = new Item();
	  	newItem.text = itemText;

	  	newItem.save((err) => {
	  		if (err) io.emit('error', err);
	  		else io.emit('item_create', newItem);
	  	});
	  });

	  socket.on('item_delete', (itemId) => {
	  	Item.findById(itemId).remove((err) => {
			if (err) io.emit('error', err);
	  		else io.emit('item_delete', itemId);
	  	});
	  });
	});

	return router;
};
