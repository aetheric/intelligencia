module.exports = function(express, data, page) {
	var defaultRedirect = data.pages.app_doc_list.path;

	express.get(page.path, function(req, res) {

		if (req.subject && req.subject.isAuthenticated()) {
			req.subject.hasRole('user', function(user) {
				if (user) {
					res.redirect(req.param.redirect || defaultRedirect);
				} else {
					res.redirect(data.pages.auth_unverified.path);
				}
			});

			return;
		}

		res.render(page.template, {
			title: 'Sign-in',
			username: req.flash.username || req.param.username,
			redirect: req.flash.redirect || req.param.redirect || defaultRedirect
		});
	});

	var invalidmsg = {
		type: 'error',
		text: 'No user exists with that name and password.'
	};

	express.post(page.path, function(req, res) {
		var username = req.body.username;
		var password = req.body.password;

		if (!username || !password) {
			res.flash.username = username;
			res.flash.message = {
				type: 'error',
				text: 'Aren\'t you forgetting something?'
			};
			
			res.redirect(page.path);
			return;
		}

		data.fnMongo(function(db) {
			db.collection('users').find({ username: username }).nextObject(function(err, user) {
				if (err) throw err;

				var hash = password;

				if (!user || user.password !== hash) {
					res.flash.username = username;
					res.flash.message = invalidmsg;
					res.redirect(page.path);
					return;
				}

				req.session.user = user;
				res.redirect(data.pages.user_dash.path);
			});
		});

	});

};
