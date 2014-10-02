module.exports = function(express, data, page) {

	var dataService = require('../../../main/service/data');
	var utilService = require('../../../main/service/util');

	express.get(page.path, function(req, res) {
		var username = req.subject.account.principal;

		var errorHandler = utilService.createErrorHandler(res, data.pages.error_server.path);

		dataService.getUserByUsername(username).then(function(user) {

			if (!user) {
				res.render(data.pages.error_missing.template, {
					title: 'User Not Found'
				});

				return;
			}

			res.render(page.template, {
				title: 'User Dashboard',
				user: {
					username: username,
					email: user.email
				}
			});

		}).catch(errorHandler);

	});

	express.post(page.path, function(req, res) {
		console.log('Saving user: ' + JSON.stringify(req.body));
		res.redirect(page.path);
	});

};
