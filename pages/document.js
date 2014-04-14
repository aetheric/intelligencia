module.exports = function(express) {
	var fs = require('fs');

	express.get('/document/:docId', function(req, res) {
		var docFile = __dirname + '/../data/documents/' + req.params.docId + '.json';
		
		//TODO: Check that file exists.
		var document = fs.readFileSync(docFile);
		var docJson = JSON.parse(document);

		res.render('document', {
			title: 'Document View',
			doc: docJson
		});
	});

};
