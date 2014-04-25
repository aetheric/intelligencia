module.exports = function(express, data) {
	var _ = require('underscore');

	express.use(function(req, res, next) {
		res.locals.req = req;
		res.locals.message = req.flash('message');
		next();
	});

	// Redirect root requests to the home page.
	express.get('/', function(req, res) {
		res.redirect(301, data.pages.auth_login.path);
	});

	_.each(data.pages, function(page) {
		if (page.script) {
			require(page.script)(express, data, page);
		}
	});

	// Handle requests that don't get routed.
	express.use(function(req, res) {
		res.status(404);

		if (req.accepts('html')) {
			res.render(data.pages.error_missing.template, {
				title: 'Missing',
				path: req.url
			});

			return;
		}

		if (req.accepts('json')) {
			res.json({
				error: 'Not found',
				path: req.url
			});

			return;
		}

		res.type('txt')
			.send('Can\'t find ' + req.url);
	});

};
