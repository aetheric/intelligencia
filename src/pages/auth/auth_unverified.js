module.exports = function(express, data, page) {
	var _ = require('underscore');

	express.get(page.path, function(req, res) {
		if (!req.session.user) {
			res.redirect(data.pages.auth_login.path);
			return;
		}

		if (_.contains(user.roles, 'user')) {
			res.redirect(data.pages.app_user_dash.path);
			return;
		}

		res.render(page.template, {
			title: 'Unverified'
		});

	});

};