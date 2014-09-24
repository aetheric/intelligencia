module.exports = function(express, data, page) {
	var dataService = require('../../../main/service/data');

	express.get(page.path, function(req, res) {
		dataService.getUserList().then(function(users) {
			res.render(page.template, {
				title: 'User List',
				users: users
			});
		}).catch(function(error) {
			res.flash.message('error', error);
			res.redirect(data.pages.error.server.path);
		});
	});

};
