module.exports = function(express, data, page) {
	var fs = require('fs');
	var userDir = data.fnDir('/../etc/users');

	express.get(page.path, function(req, res) {
		var username = req.subject.account.principal;
		var fileName = userDir + '/' + username + '.json';

		fs.exists(fileName, function(exists) {
			if (!exists) {
				res.render(data.pages.error_missing.template, {
					title: 'User Not Found'
				});

				return;
			}

			fs.readFile(fileName, function(err, document) {
				if (err) {
					res.render(data.pages.error_server.template, {
						title: 'Error Reading User'
					});

					return;
				}

				var docJson = JSON.parse(document);

				res.render(page.template, {
					title: 'User Dashboard',
					user: {
						username: username,
						email: docJson.email,
						diatribe: docJson.diatribe,
						city: docJson.city
					}
				});
			});
		});
	});

	express.post(page.path, function(req, res) {
		console.log('Saving user: ' + JSON.stringify(req.body));
		res.redirect(page.path);
	});

};