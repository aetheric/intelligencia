module.exports = function(express, data, page) {

	var dataService = require('../../../main/service/data');
	var utilService = require('../../../main/service/util');

	express.get(page.path, function(req, res) {

		var errorHandler = utilService.createErrorHandler(res, data.pages.error_server.path);

		dataService.getDocumentList().then(function(items) {
			res.render(page.template, {
				title: 'Document List',
				docs: items
			});
		}).catch(errorHandler);

	});
};
