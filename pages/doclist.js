module.exports = function(express) {
	var fs = require('fs');
	var docDir = __dirname + '/../data/documents';

	express.get('/document/list', function(req, res) {
		var documents = [];

		var files = fs.listFileSync(docDir);
		for (var i = 0; i < files.length; i++) {
			if (!files.match(/\.json$/)) {
				continue;
			}

			var fileName = docDir + '/' + files[i];

			var stats = fs.statSync(fileName);

			var document = fs.readFileSync(fileName);
			var docJson = JSON.parse(document);

			documents.push({
				title: docJson.title,
				author: docJson.author,
				clearance: docJson.clearance,
				edited: stats.mtime
			});
		}

		res.render('doclist', {
			title: 'Document List',
			docs: documents
		});
	});
};
