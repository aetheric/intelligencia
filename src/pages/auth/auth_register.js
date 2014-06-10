module.exports = function(express, data, page) {

	express.get(page.path, function(req, res) {
		if (req.session.user) {
			res.flash.message('info', 'You\'re already authenticated, you don\'t need to sign-in.');
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

		data.fnMongo(function(err, db) {
			if (data.fnHandleError(res, err)) return;

			var users = db.collection('users');

			users.find({ email: req.body.email }).nextObject(function(err, item) {
				if (data.fnHandleError(res, err)) return;

				if (item) {
					res.flash.username = req.body.username;
					res.flash.email = req.body.email;
					res.flash.message('error', 'That user already exists!');

					res.redirect(page.path);
					return;
				}

				users.insert({
					username: req.body.username,
					password: data.fnEncryptPass(req.body.password1),
					email: req.body.email
				}, { safe: true }, function(err, item) {
					if (data.fnHandleError(res, err)) return;

					res.flash.username = item[0].username;
					res.flash.message('success', 'You have successfully registered. Please wait for verification.');
					res.redirect(data.pages.auth_login.path);
				});
			});
		});
	});

};
