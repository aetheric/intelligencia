module.exports = function(express, data, page) {
	var defaultRedirect = '/app/document/list';

	express.get(page.path + 'login', function(req, res) {

		if (req.subject && req.subject.isAuthenticated()) {
			res.redirect(req.param.redirect || defaultRedirect);
		}

		res.render(page.template, {
			title: 'Sign-in',
			username: req.param.username,
			redirect: req.param.redirect || defaultRedirect
		});
	});

};
