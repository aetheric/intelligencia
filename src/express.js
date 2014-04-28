module.exports = function(data) {

	var Express = require('express');
	var express = Express();

	var flash = require('./utils/flash');

	// configure the express server
	express.configure(function() {
		express.set('views', data.fnDir('/pages'));
		express.set('view engine', 'jade');
		express.set('view options', { layout: false });

		express.use(Express.static(data.fnDir('/static')));
		express.use(Express.cookieParser());
		express.use(Express.bodyParser());
		express.use(Express.methodOverride());
		express.use(Express.session({
			secret: 'topsecret',
			cookie: {
				httpOnly: true,
				secure: false
			}
		}));

		express.use(flash());
	});

	return express;
};
