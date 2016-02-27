var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var uri = 'mongodb://heroku_50wwz2b9:tvst8bquk7n3bc4mvuan4n2e83@ds017688.mlab.com:17688/heroku_50wwz2b9';
mongoose.connect(uri);

var ItemSchema = new Schema({
	text: String,
	checked: {type: Boolean, default: false},
},{
	timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
});

module.exports = mongoose.model('Item', ItemSchema);
