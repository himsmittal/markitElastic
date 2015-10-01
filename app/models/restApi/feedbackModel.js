var mongoose = require('mongoose');

var Schema  = mongoose.Schema;

var dbSchema   = new Schema({
    'name'		: String,
	'email'		: String,
	'suggestions'	: String,
	'rate'		: Number
});

module.exports = mongoose.model('feedbackModel', dbSchema);


