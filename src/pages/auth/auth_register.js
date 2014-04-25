module.exports = function(express, data, page) {

	express.get(page.path, function(req, res) {
		if (req.subject.isAuthenticated()) {
			res.redirect(data.pages.app_user_dash.path);
			return;
		}

		res.render(page.template, {
			title: 'Register',
			username: req.params.username,
			email: req.params.email,
			message: {
				type: 'error',
				text: req.params.error
			}
		});
	});

	express.post(page.path, function(req, res) {
		//TODO: validate

		data.fnMongo(function(db) {
			var users = db.collection('users');

			users.find({ email: req.body.email }).nextObject(function(err, item) {
				if (err) {
					res.redirect(data.pages.error_server.path);
					return;
				}

				if (item) {
					res.redirect(page.path, {
						username: req.body.username,
						email: req.body.email,
						error: 'That user already exists!'
					});

					return;
				}

				users.insert({
					username: req.body.username,
					password: data.fnEncryptPass(req.body.password1),
					email: req.body.email
				}, { safe: true }, function(err, item) {
					if (err) {
						res.redirect(data.pages.error_server.path);
						return;
					}

					res.redirect(data.pages.auth_login.path, {
						username: item.username
					});
				});
			});
		});
	});

};
