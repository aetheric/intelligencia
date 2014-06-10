module.exports = function(express, data, page) {

	express.get(page.path, function(req, res) {
		res.render(page.template, {
			title: 'Submission',
			character: req.flash.character,
			content: req.flash.content
		});
	});

	express.post(page.path, function(req, res) {
		//TODO: validate

		var username = req.subject.principal.name;

		data.fnMongo(function(err, db) {
			if (data.fnHandleError(res, err)) return;

			db.collection('info').insert({
				submitter: username,
				submitted: new Date(),
				content: req.body.content
			}, { safe: true }, function(err, items) {
				if (data.fnHandleError(res, err)) return;

				res.flash.message = {
					type: 'success',
					text: 'Congratulations, you\'ve successfully submitted a piece of intelligence for consideration.'
				};

				res.redirect(page.path);
			});
		});
	});

};