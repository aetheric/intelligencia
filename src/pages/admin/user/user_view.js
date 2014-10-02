module.exports = function(express, data, page) {

	var dataService = require('../../../main/service/data');
	var utilService = require('../../../main/service/util');

	express.get(page.path + '/:userId', function(req, res) {

		var errorHandler = utilService.createErrorHandler(res, data.pages.error_server.path);

		dataService.getUserById(req.params.userId).then(function(user) {
			res.render(page.template, {
				title: 'User Detail',
				user: user
			});
		}).catch(errorHandler);

	});

};
