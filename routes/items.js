var express = require('express');
var router = express.Router();

var Item = require('../models/item');


/* GET users listing. */
router.get('/', (req, res) => {

	Item.find().sort({index: 1}).exec((err, items) => {
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

		item.text = req.body.text;
		item.checked = req.body.checked;

		res.json({message: 'Item updated!', item: item});

	});
});

router.delete('/:item_id', (req, res) => {
	Item.remove({
		_id: req.params.item_id
	}, (err, item) => {
		if (err) res.send(err);

		res.json({message: 'Item deleted'});
	});
});

router.post('/', (req, res) => {

	var item = new Item();
	item.text = req.body.text;

	item.save((err) => {
		if (err) res.send(err);

		res.json({message: 'Item created!', item: item});
	});
});

module.exports = router;
