module.exports = function(express, data, page) {
	var _ = require('underscore');

	var dataService = require('../../main/service/data');
	var mailService = require('../../main/service/mail');
	var utilService = require('../../main/service/util');

	express.get(page.path, function(req, res) {
		res.render(page.template, {
			title: 'Recover Password',
			email: req.flash.email
		});
	});

	express.post(page.path, function(req, res) {
		var email = req.body.email;

		if (!email) {
			res.flash.message('error', 'You\'ll need to provide an email to recover your password.');
			res.redirect(page.path);
			return;
		}

		var errorHandler = utilService.createErrorHandler(res, data.pages.error_server.path);

		dataService.getUserByEmail(email).then(function(user) {

			if (!user) {
				res.flash.email = email;
				res.flash.message('error', 'No user could be found with that email address.');
				res.redirect(page.path);
				return;
			}

			var code = 'pumpernickle';

			dataService.addRecovery(user._id, email, code).catch(handleError(res)).then(function(recovery) {
				var email = recovery[0].email;
				var code = recovery[0].code;

				var details = '[ email: {}, code: {} ]'.format(email, code);

				if (!email || !code) {
					var error = new Error('Recovery details are missing: {}.'.format(details));
					errorHandler(error);
					return;
				}

				console.log('Attempting to send password recovery email: {}.'.format(details));

				mailService.send({
					to: email,
					subject: 'Password Recovery',
					template: 'password_recovery',
					context: {
						email: email,
						code: code
					}
				}).then(function() {
					res.flash.message('success', 'Recovery email sent to provided address.');
					res.redirect(data.pages.auth_login.path);
				}).catch(errorHandler);

			});

		}).catch(errorHandler);

	});

};
