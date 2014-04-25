'use strict';

// Start up newrelic monitoring
require('newrelic');

var _ = require('underscore');

var data = {

	env: {
		current: process.env.NODE_ENV || 'development',
		port: process.env.PORT || 8015
	},

	pages: {},

	clearances: _.extend([
		'alpha',
		'beta',
		'gamma',
		'delta',
		'epsilon'
	], {
		alpha: 0,
		beta: 1,
		gamma: 2,
		delta: 3,
		epsilon: 4
	}),

	fnDir: function(path) {
		return __dirname + path;
	}

};

_.extend(data.env, {
	dev: data.env.current === 'development',
	prod: data.env.current === 'production'
});

require('./utils/utils')(data);
require('./utils/pagescan')(data);
require('./utils/redacter')(data);
require('./utils/mongo')(data);

// init and set up express.
var express = require('./express')(data);

// Configure security and routing.
require('./security')(express, data);
require('./routing')(express, data);

// Start the server
console.log("Starting server in ", data.env.current);
console.log("Express starting on port ", data.env.port);

express.listen(data.env.port);
