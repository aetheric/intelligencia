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

require('./main/service/data').init({
	user: process.env.DB_USER || 'intelligencia',
	pass: process.env.DB_PASS || 'password',
	host: process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT || '27017',
	path: process.env.DB_PATH || 'intelligencia'
});

require('./main/service/mail').init({
	username: process.env.MAIL_USER || 'intelligencia@aetheric.co.nz',
	password: process.env.MAIL_PASS || 'password',
	debug: data.env.dev
});

// prototype extension utils
require('./utils/utils')();

require('./main/service/util').init();
require('./main/service/redacter').init();

require('./utils/pagescan')(data);

// init and set up express.
var express = require('./express')(data);

// Configure security and routing.
require('./main/middleware/security')(express, data);
require('./routing')(express, data);

// Start the server
console.log("Starting server in ", data.env.current);
console.log("Express starting on port ", data.env.port);

express.listen(data.env.port);
