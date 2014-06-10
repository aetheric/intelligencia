module.exports = function(express, data, page) {

	express.get(page.path, function(req, res) {
		var username = req.subject.account.principal;

		data.fnMongo(function(err, db) {
			if (data.fnHandleError(res, err)) return;

			db.collection('users').find({ username: username }).nextObject(function(err, doc) {
				if (data.fnHandleError(res, err)) return;

				if (!doc) {
					res.render(data.pages.error_missing.template, {
						title: 'User Not Found'
					});

					return;
				}

				res.render(page.template, {
					title: 'User Dashboard',
					user: {
						username: username,
						email: doc.email
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