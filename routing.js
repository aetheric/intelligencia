module.exports = function(express) {

	// Redirect root requests to the home page.
	express.get('/', function(req, res) {
		res.redirect(301, '/login');
	});

	var pagesDir = __dirname + '/pages';
	var files = require('fs').readdirSync(pagesDir);
	for (var i = 0; i < files.length; i++) {
		var file = files[i];

		// if the file is javascript
		if (file.match(/\.js$/)) {
			// then load it as a routing file.
			require(pagesDir + '/' + file)(express);
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
