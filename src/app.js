'use strict';

// Start up newrelic monitoring
require('newrelic');

var _ = require('underscore');

var data = {

	env: {
		current: process.env.NODE_ENV || 'development',
		port: process.env.PORT || 8015,

		db: {
			user: process.env.DB_USER || 'intelligencia',
			pass: process.env.DB_PASS,
			host: process.env.DB_HOST || 'oceanic.mongohq.com',
			port: process.env.DB_PORT || '10096',
			path: process.env.DB_PATH || 'app24119285'
		},

		mail: {
			user: process.env.MAIL_USER || 'intelligencia@aetheric.co.nz',
			pass: process.env.MAIL_PASS
		}

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

data.fnRedact = require('./utils/redacter');
data.fnMail = require('./utils/mail');

require('./utils/pagescan')(data);

require('./utils/utils')(data);
require('./utils/mongo')(data);

// init and set up express.
var express = require('./express')(data);

// Configure security and routing.
require('./utils/security')(express, data);
require('./routing')(express, data);

// Start the server
console.log("Starting server in ", data.env.current);
console.log("Express starting on port ", data.env.port);

express.listen(data.env.port);
