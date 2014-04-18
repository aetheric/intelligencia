module.exports = function(express, data, page) {

	express.get(page.path, function(req, res) {
		if (req.subject.isAuthenticated()) {
			res.redirect(data.pages.app_user_dash.path);
			return;
		}

		res.render(page.template, {
			title: 'Register'
		});
	});

};
