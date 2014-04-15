module.exports = function(express) {
	var fs = require('fs');
	var userDir = __dirname + '/../data/users';

	function login(username, password, callback) {
		var userFile = userDir + '/' + username + '.json';
		fs.exists(userFile, function(exists) {
			if (!exists) {
				callback(null);
				return;
			}

			fs.readFile(userFile, function(err, document) {
				if (err) {
					callback(null);
					return;
				}

				var userJson = JSON.parse(document);
				if (userJson.password !== password) {
					callback(null);
				}

				callback(userJson);
			});
		});
	}

	express.get('/login', function(req, res) {
		if (req.session.user) {
			res.redirect('/document/list');
		}

		res.render('login', {
			title: 'Sign-in',
			error: req.query.error,
			user: req.query.user
		});
	});

	express.post('/login', function(req, res) {

		var user = req.body.username;
		if (!user) {
			res.redirect('/login?error=user');
			return;
		}

		var pass = req.body.password;
		if (!pass) {
			res.redirect('/login?error=pass&user=' + user);
			return;
		}

		login(user, pass, function(user) {
			if (!user) {
				res.redirect('/login?error=cred&user=' + user);
				return;
			}

			req.session.user = user;
			res.redirect('/document/list');
		});

	});

};
