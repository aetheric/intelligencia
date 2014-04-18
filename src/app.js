'use strict';

// Start up newrelic monitoring
require('newrelic');

// initialise the context and port vars
var port = process.env.PORT || 8015;
var env = process.env.NODE_ENV || 'development';

function fnDir(path) {
	return __dirname + path;
}

// init and set up express.
var express = require('./express')(fnDir);

// Configure security and routing.
require('./security')(express, fnDir);
require('./routing')(express, fnDir);

// Start the server
console.log("Starting server in ", env);
console.log("Express starting on port ", port);

express.listen(port);
