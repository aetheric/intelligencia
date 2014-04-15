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

	express.get('/logout', function(req, res) {
		res.render('logout', {
			title: 'Sign-out'
		});
	});

	express.post('/logout', function(req, res) {
		req.session.user = null;
		res.redirect('/login');
	});

};
