module.exports = function(express, fnDir) {
	var fs = require('fs');
	var docDir = fnDir('/../etc/documents');

	express.get('/app/document/list', function(req, res) {
		var documents = [];

		fs.readdir(docDir, function(err, files) {
			if (err) {
				res.render('500', {
					title: 'Directory List Error'
				});

				return;
			}

			for (var i = 0; i < files.length; i++) {
				var fileName = docDir + '/' + files[i];

				if (!fileName.match(/\.json$/)) {
					continue;
				}

				var stats = fs.statSync(fileName);

				var document = fs.readFileSync(fileName);
				var docJson = JSON.parse(document);

				documents.push({
					id: files[i].substring(0, files[i].lastIndexOf('.')),
					title: docJson.title,
					author: docJson.author,
					clearance: docJson.clearance,
					edited: stats.mtime
				});
			}

			res.render('doc_list', {
				title: 'Document List',
				docs: documents
			});
		});
	});
};
