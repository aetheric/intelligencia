module.exports = function(express, data, page) {

	express.get(page.path, function(req, res) {
		if (req.subject.isAuthenticated()) {
			res.flash.message = {
				type: 'info',
				text: 'You\'re already authenticated, you don\'t need to sign-in.'
			};

			res.redirect(data.pages.app_user_dash.path);
			return;
		}

		res.render(page.template, {
			title: 'Register',
			username: req.flash.username,
			email: req.flash.email
		});
	});

	express.post(page.path, function(req, res) {
		//TODO: validate

		data.fnMongo(function(db) {
			var users = db.collection('users');

			users.find({ email: req.body.email }).nextObject(function(err, item) {
				if (err) {
					res.flash.message = {
						type: 'error',
						text: err.message
					};

					res.redirect(data.pages.error_server.path);
					return;
				}

				if (item) {
					res.flash.username = req.body.username;
					res.flash.email = req.body.email;
					res.flash.message = {
						type: 'error',
						text: 'That user already exists!'
					};

					res.redirect(page.path);
					return;
				}

				users.insert({
					username: req.body.username,
					password: data.fnEncryptPass(req.body.password1),
					email: req.body.email
				}, { safe: true }, function(err, item) {
					if (err) {
						res.flash.message = {
							type: 'error',
							text: err.message
						};

						res.redirect(data.pages.error_server.path);
						return;
					}

					res.flash.username = item[0].username;
					res.flash.message = {
						type: 'success',
						text: 'You have successfully registered. Please wait for verification.'
					};

					res.redirect(data.pages.auth_login.path);
				});
			});
		});
	});

};
