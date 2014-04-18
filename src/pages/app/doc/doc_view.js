module.exports = function(express, data, page) {
	var fs = require('fs');
	var docDir = data.fnDir('/../etc/documents');

	express.get(page.path + 'view/:docId', function(req, res) {
		var docFile = docDir + '/' + req.params.docId + '.json';

		fs.exists(docFile, function(exists) {
			if (!exists) {
				res.render(data.pages.error_missing.template, {
					title: 'Document Not Found'
				});

				return;
			}

			fs.readFile(docFile, function(err, document) {
				if (err) {
					res.render('500', {
						title: 'Error Reading Document'
					});

					return;
				}

				var docJson = JSON.parse(document);

				res.render(page.template, {
					title: 'Document View',
					doc: docJson
				});
			});
		});
	});

};
