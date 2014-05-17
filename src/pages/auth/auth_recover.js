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
			res.flash.message = {
				type: 'error',
				text: 'You\'ll need to provide an email to recover your password.'
			};

			res.redirect(page.path);
			return;
		}

		data.fnMongo(function(db) {
			db.collection('users').find({ email: email }).nextObject(function(err, user) {
				if (err) throw err;

				if (!user) {
					res.flash.email = email;
					res.flash.message = {
						type: 'error',
						text: 'No user could be found with that email address.'
					};

					res.redirect(page.path);
					return;
				}

				var code = 'pumpernickle';

				db.collection('recovery').insert({
					email: email,
					code: code
				}, function(err, recovery) {
					if (err) throw err;

					//TODO: send email to address with code.

					res.flash.message = {
						type: 'success',
						text: 'Recovery email sent to address.'
					};

					res.redirect(page.path);
				});

			});
		});

	});

};