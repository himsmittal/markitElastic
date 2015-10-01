var mongoose = require('mongoose');

var askTomSchema       = mongoose.Schema;

var dbSchema   = new askTomSchema({
    'link'		: String,
	'title'		: String,
	'keywords'	: Array,
	'count'		: { type: Number, default: 1},
    'click'     : Number
});

module.exports = mongoose.model('askTomModel', dbSchema);


