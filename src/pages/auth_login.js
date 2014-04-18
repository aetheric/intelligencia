module.exports = function(express) {
	var defaultRedirect = '/app/document/list';

	express.get('/auth/login', function(req, res) {

		if (req.subject && req.subject.isAuthenticated()) {
			res.redirect(req.param.redirect || defaultRedirect);
		}

		res.render('auth_login', {
			title: 'Sign-in',
			username: req.param.username,
			redirect: req.param.redirect || defaultRedirect
		});
	});

};
