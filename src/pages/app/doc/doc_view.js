module.exports = function(express, data, page) {

	var dataService = require('../../../main/service/data');
	var utilService = require('../../../main/service/util');

	express.get(page.path + '/:docId', function(req, res) {
		var docId = req.params.docId;

		var errorHandler = utilService.createErrorHandler(res, data.pages.error_server.path);

		dataService.getDocumentById(docId).then(function(item) {

			// TODO: Handle missing document.

			res.render(page.template, {
				title: 'Document View',
				doc: item,
				content: data.fnRedact(item.content, req.subject)
			});

		}).catch(errorHandler);

	});

};
