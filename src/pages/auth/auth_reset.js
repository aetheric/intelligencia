module.exports = function(express, data, page) {
	var _ = require('underscore');
	var sha256 = require('crypto-js/sha256');

	express.get(page.path, function(req, res) {
		res.render(page.template, {
			title: 'Password Reset',
			code: req.param.code || req.flash.code,
			email: req.param.email || req.flash.email
		});
	});

	express.post(page.path, function(req, res) {
		var code = req.body.code;
		var email = req.body.email;
		var pass1 = req.body.password1;
		var pass2 = req.body.password2;

		if (!code || !email || !pass1 || !pass2) {
			_.extend(res.flash, req.body);
			res.flash.message('error', 'Are you forgetting something?');
			res.redirect(page.path);
			return;
		}

		if (pass1 !== pass2) {
			_.extend(res.flash, req.body);
			res.flash.message('error', 'The two provided passwords do not match.');
			res.redirect(page.path);
			return;
		}

		data.fnMongo(function(err, db) {
			if (data.fnHandleError(res, err)) return;

			db.collection('recovery').find({ code: code, email: email }).nextObject(function(err, recovery) {
				if (data.fnHandleError(res, err)) return;

				if (!recovery) {
					res.flash.message('error', 'The recovery code you just used has expired.');
					res.redirect(page.path);
					return;
				}

				var users = db.collection('users');
				users.find({ _id: recovery.userId }).nextObject(function(err, user) {
					if (data.fnHandleError(res, err)) return;

					if (!user) {
						res.flash.message('error', 'The user for that recovery code has expired.');
						res.redirect(page.path);
						return;
					}

					user.password = sha256(user.username + pass1);
					users.update(user, function(err) {
						if (data.fnHandleError(res, err)) return;

						res.flash.username = user.name;
						res.flash.message('success', 'The password has been successfully updated.');
						res.redirect(data.pages.auth_login.path);
					});
				});
			});
		});
	});

};