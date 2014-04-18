module.exports = function(express, fnDir) {

	express.use(function(req, res, next) {
		res.locals.req = req;
		next();
	});

	// Redirect root requests to the home page.
	express.get('/', function(req, res) {
		res.redirect(301, '/auth/login');
	});

	var pagesDir = fnDir('/pages');
	var files = require('fs').readdirSync(pagesDir);
	for (var i = 0; i < files.length; i++) {
		var file = files[i];

		// if the file is javascript
		if (file.match(/\.js$/)) {
			var absoluteFile = pagesDir + '/' + file;
			console.log('Loading routing rules from ' + absoluteFile);

			// then load it as a routing file.
			require(absoluteFile)(express, fnDir);
		}
	}

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
