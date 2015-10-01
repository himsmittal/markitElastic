//define required dependencies
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


var port = process.env.PORT || 8082;

//db connection 
var database = require('./config/database');

//connect to the db
mongoose.connect(database.url);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//app.use(express.static(__dirname + '/dist')); 	// set the static files location
app.use(express.static( 'public')); 	// set the static files location
//app.use(express.static(__dirname + '/scripts')); 	// set the static files location


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

require('./app/routes.js')(app);


app.listen(port);
console.log('Magic happens on port ' + port);   

exports = module.exports = app;
