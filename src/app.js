'use strict';

// Start up newrelic monitoring
require('newrelic');

// initialise the context and port vars
var port = process.env.PORT || 8015;
var env = process.env.NODE_ENV || 'development';

var data = {

	pages: {},

	fnDir: function(path) {
		return __dirname + path;
	}

};

require('./utils/utils')(data);
require('./utils/pagescan')(data);
require('./utils/redacter')(data);

// init and set up express.
var express = require('./express')(data);

// Configure security and routing.
require('./security')(express, data);
require('./routing')(express, data);

// Start the server
console.log("Starting server in ", env);
console.log("Express starting on port ", port);

express.listen(port);
