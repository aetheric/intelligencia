module.exports = function(express, data, page) {
	var sha256 = require('crypto-js/sha256');
	var defaultRedirect = data.pages.app_doc_list.path;
	function getRedirect(req) {
		return req.flash.redirect || defaultRedirect;
	}

	express.get(page.path, function(req, res) {
		var user = req.session.user;

		if (user) {
			if (!_.contains(user.roles, 'user')) {
				res.redirect(data.pages.auth_unverified.path);
				return;
			}

			res.redirect(getRedirect(req));
			return;
		}

		res.render(page.template, {
			title: 'Sign-in',
			username: req.flash.username,
			redirect: getRedirect(req)
		});
	});

	express.post(page.path, function(req, res) {
		var username = req.body.username;
		var password = req.body.password;

		if (!username || !password) {
			res.flash.username = username;
			res.flash.message('error', 'Aren\'t you forgetting something?');
			res.redirect(page.path);
			return;
		}

		data.fnMongo(function(err, db) {
			if (err) {
				res.flash.message('error', err.message);
				res.redirect(data.pages.error_server.path);
				return;
			}

			db.collection('users').find({ username: username }).nextObject(function(err, user) {
				if (err) throw err;

				var hash = sha256(username + password);
				if (!user || user.password !== hash) {
					res.flash.username = username;
					res.flash.message('error', 'No user exists with that name and password.');
					res.redirect(page.path);
					return;
				}

				req.session.user = user;
				res.redirect(getRedirect(req));
			});
		});

	});

};
