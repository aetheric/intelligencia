module.exports = function(express) {
	var fs = require('fs');
	var docDir = __dirname + '/../data/documents';

	express.get('/app/document/view/:docId', function(req, res) {
		var docFile = docDir + '/' + req.params.docId + '.json';

		fs.exists(docFile, function(exists) {
			if (!exists) {
				res.render('404', {
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

				res.render('document', {
					title: 'Document View',
					doc: docJson
				});
			});
		});
	});

};
