module.exports = function(express) {
	var defaultRedirect = '/app/document/list';

	express.get('/login', function(req, res) {

		if (req.subject && req.subject.isAuthenticated()) {
			res.redirect(req.param.redirect || defaultRedirect);
		}

		res.render('login', {
			title: 'Sign-in',
			username: req.param.username,
			redirect: req.param.redirect || defaultRedirect
		});
	});

};
