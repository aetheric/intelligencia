module.exports = function(express, fnDir) {
	var fs = require('fs');
	var _ = require('underscore');

	express.use(function(req, res, next) {
		res.locals.req = req;
		next();
	});

	// Redirect root requests to the home page.
	express.get('/', function(req, res) {
		res.redirect(301, '/auth/login');
	});

	function process(dirname, path) {
		var files = require('fs').readdirSync(pagesDir);
		_.each(files, function(file) {
			var fileName = dirname + '/' + file;
			var stats = fs.statSync(fileName);

			if (stats.isDirectory()) {
				process(fileName, path + dirname + '/');
				return;
			}

			if (!stats.isFile() || !file.match(/\.js$/)) {
				return;
			}

			console.log('Loading routing rules from "' + fileName + '".');

			// then load it as a routing file.
			require(fileName)(express, fnDir, path);
		});
	}

	var pagesDir = fnDir('/pages');
	process(pagesDir, '/');

	// Handle requests that don't get routed.
	express.use(function(req, res) {
		res.status(404);

		if (req.accepts('html')) {
			res.render('404', {
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
