var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
var uri = 'mongodb://heroku_50wwz2b9:tvst8bquk7n3bc4mvuan4n2e83@ds017688.mlab.com:17688/heroku_50wwz2b9';

var Item = require('../models/item');


/* GET users listing. */
router.get('/', (req, res) => {

	Item.find((err, items) => {
		if (err) res.send(err);

		res.json(items);
	});
});

router.get('/:item_id', (req, res) => {
	Item.findById(req.params.item_id, (err, item) => {
		if (err) res.send(err);

		res.json(item);
	});
});

router.put('/:item_id', (req, res) => {
	Item.findById(req.params.item_id, (err, item) => {
		if (err) res.send(err);

		console.log(req.body);

		item.text = req.body.text;
		item.date = Date.now();
		item.checked = req.body.checked;

		res.json({message: 'Item updated!', item: item});

	});
});

router.delete('/:item_id', (req, res => {
	Item.remove({
		_id: req.params.item_id
	}, (err, item) => {
		if (err) res.send(err);

		res.json({message: 'Item deleted'});
	});
}));

router.post('/', (req, res) => {

	var item = new Item();
	item.text = req.body.text;
	item.date = Date.now();
	item.checked = false;

	item.save((err) => {
		if (err) res.send(err);

		res.json({message: 'Item created!', item: item});
	});
});

module.exports = router;
