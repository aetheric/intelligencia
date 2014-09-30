module.exports = function(express, data, page) {
	var _ = require('underscore');

	var dataService = require('../../main/service/data');

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

		var username = req.body.username;
		var password = data.fnEncryptPass(req.body.password1);
		var email = req.body.email;

		//TODO: validate

		var catcher = _.partial(data.fnHandleError, res);

		dataService.getUserByEmail(email).then(function(user) {

			if (user) {
				res.flash.username = req.body.username;
				res.flash.email = req.body.email;
				res.flash.message('error', 'That user already exists!');

				res.redirect(page.path);
				return;
			}

			dataService.addUser(username, password, email).then(function() {
				res.flash.username = username;
				res.flash.message('success', 'You have successfully registered. Please wait for verification.');
				res.redirect(data.pages.auth_login.path);
			}).catch(catcher);
		}).catch(catcher);

	});

};
