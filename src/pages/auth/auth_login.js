module.exports = function(express, data, page) {
	var defaultRedirect = data.pages.app_doc_list.path;

	express.get(page.path, function(req, res) {

		if (req.subject && req.subject.isAuthenticated()) {
			req.subject.hasRole('user', function(user) {
				if (user) {
					res.redirect(req.param.redirect || defaultRedirect);
				} else {
					res.redirect(data.pages.auth_unverified.path);
				}
			});

			return;
		}

		res.render(page.template, {
			title: 'Sign-in',
			username: req.param.username,
			redirect: req.param.redirect || defaultRedirect
		});
	});

};
