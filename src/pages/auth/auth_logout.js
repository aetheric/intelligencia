module.exports = function(express, data, page) {
	
	express.get(page.path, function(req, res) {
		res.render(page.template, {
			title: 'Sign-out'
		});
	});

	express.post(page.path, function(req, res) {
		var session = req.session;

		// Null out the user principal.
		session.user = null;
		session.destroy();

		res.flash.message = {
			type: 'success',
			text: 'You have been successfully logged-out'
		};

		res.redirect(data.pages.auth_login.path);
	});

};
