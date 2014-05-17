module.exports = function(express, data, page) {
	var sha256 = require('crypto-js/sha256');

	var defaultRedirect = data.pages.app_doc_list.path;
	function getRedirect(req) {
		return req.flash.redirect || defaultRedirect;
	}

	express.get(page.path, function(req, res) {

		if (req.session.user) {
			res.redirect(getRedirect(req));
			return;
		}

		res.render(page.template, {
			title: 'Sign-in',
			username: req.flash.username,
			redirect: getRedirect(req)
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

				var hash = sha256(username + password);
				if (!user || user.password !== hash) {
					res.flash.username = username;
					res.flash.message = invalidmsg;
					res.redirect(page.path);
					return;
				}

				req.session.user = user;
				res.redirect(getRedirect(req));
			});
		});

	});

};
