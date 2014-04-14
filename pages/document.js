module.exports = function(express) {

	express.get('/document/:docId', function(req, res) {

		var document = null;

		res.render('document', {
			title: 'Document View',
			doc: document
		});
	});

});
