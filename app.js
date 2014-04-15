'use strict';

// Start up newrelic monitoring
require('newrelic');

// initialise the context and port vars
var port = process.env.PORT || 8015;
var env = process.env.NODE_ENV || 'development';

// init and set up express.
var express = require('./express')();

// Configure security and routing.
require('./security')(express);
require('./routing')(express);

// Start the server
console.log("Starting server in ", env);
console.log("Express starting on port ", port);

express.listen(port);
