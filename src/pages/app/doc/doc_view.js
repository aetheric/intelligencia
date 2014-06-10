module.exports = function(express, data, page) {

	express.get(page.path + '/:docId', function(req, res) {
		var docId = data.fnMongoId(req.params.docId);

		data.fnMongo(function(err, db) {
			if (data.fnHandleError(res, err)) return;

			db.collection('docs').find({ _id: docId }).nextObject(function(err, doc) {
				if (data.fnHandleError(res, err)) return;

				res.render(page.template, {
					title: 'Document View',
					doc: doc,
					content: data.fnRedact(doc)
				});
			});
		});

	});

};
