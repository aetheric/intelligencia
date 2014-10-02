module.exports = function(express, data, page) {

	var dataService = require('../../../main/service/data');
	var utilService = require('../../../main/service/util');

	express.get(page.path, function(req, res) {
		res.render(page.template, {
			title: 'Submission',
			character: req.flash.character,
			content: req.flash.content
		});
	});

	express.post(page.path, function(req, res) {
		var username = req.subject.principal.name;
		var content = req.body.content;

		//TODO: validate

		var errorHandler = utilService.createErrorHandler(res, data.pages.error_server.path);

		dataService.addIntel(username, content).then(function() {
			res.flash.message = {
				type: 'success',
				text: 'Congratulations, you\'ve successfully submitted a piece of intelligence for consideration.'
			};

			res.redirect(page.path);
		}).catch(errorHandler);

	});

};
