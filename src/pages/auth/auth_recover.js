module.exports = function(express, data, page) {
	var _ = require('underscore');

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

		data.fnMongo(function(err, db) {
			if (data.fnHandleError(res, err)) return;

			db.collection('users').find({ email: email }).nextObject(function(err, user) {
				if (data.fnHandleError(res, err)) return;

				if (!user) {
					res.flash.email = email;
					res.flash.message('error', 'No user could be found with that email address.');
					res.redirect(page.path);
					return;
				}

				var code = 'pumpernickle';

				db.collection('recovery').insert({
					userId: user._id,
					email: email,
					code: code
				}, function(err, recovery) {
					if (data.fnHandleError(res, err)) return;

					data.fnMail({
						to: email,
						subject: 'Password Recovery',
						template: 'password_recovery',
						context: {
							email: recovery.email,
							code: recovery.code
						}
					}, function(err) {
						if (data.fnHandleError(res, err)) return;

						res.flash.message('success', 'Recovery email sent to provided address.');
						res.redirect(page.path);
					});

				});

			});
		});

	});

};