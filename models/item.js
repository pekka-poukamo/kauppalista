var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var uri = process.env.MONGOLAB_URI || 'mongodb://node:node@localhost/test';
mongoose.connect(uri, (err) => {
	console.log(err);
});

var ItemSchema = new Schema({
	text: String,
	checked: {type: Boolean, default: false},
},{
	timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
});

module.exports = mongoose.model('Item', ItemSchema);
