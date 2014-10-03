module.exports = function(express, data, page) {
	var _ = require('underscore');
	var sha256 = require('crypto-js/sha256');

	var dataService = require('../../../main/service/data');
	var utilService = requrie('../../../main/service/util');

	express.get(page.path, function(req, res) {
		res.render(page.template, {
			title: 'Password Reset',
			code: req.query.code || req.flash.code,
			email: req.query.email || req.flash.email
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

		var errorHandler = utilService.createErrorHandler(res, data.pages.error_server.path);

		data.getRecoveryByEmailAndCode(email, code).then(function(recovery) {

			if (!recovery) {
				res.flash.message('error', 'The recovery code you just used has expired.');
				res.redirect(page.path);
				return;
			}

			data.getUserById(recovery.userId).then(function(user) {

				if (!user) {
					res.flash.message('error', 'The user for that recovery code has expired.');
					res.redirect(page.path);
					return;
				}

				user.password = sha256(user.username + pass1);

				data.updateUser(user).then(function() {
					res.flash.username = user.name;
					res.flash.message('success', 'The password has been successfully updated.');
					res.redirect(data.pages.auth_login.path);
				}).catch(errorHandler);

			}).catch(errorHandler);

		}).catch(errorHandler);

	});

};
