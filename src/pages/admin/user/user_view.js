module.exports = function(express, data, page) {
	var dataService = require('../../../main/service/data');

	express.get(page.path + '/:userId', function(req, res) {
		dataService.getUserById(req.params.userId).then(function(user) {
			res.render(page.template, {
				title: 'User Detail',
				user: user
			});
		}).catch(function(error) {
			res.flash.message('error', error);
			res.redirect(data.pages.error.server.path);
		});
	});

};
