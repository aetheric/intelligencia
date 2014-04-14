module.exports = function(express) {

	// Redirect root requests to the home page.
	express.get('/', function(req, res) {
		res.redirect(301, '/login');
	});

	require('./pages/login')(express);

	// Handle requests that don't get routed.
	express.use(function(req, res) {
		res.status(404);
		
		if (req.accepts('html')) {
			res.render('404', {
				title: 'Missing',
				path: req.url,
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
