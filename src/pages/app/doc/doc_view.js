module.exports = function(express, data, page) {

	express.get(page.path + '/:docId', function(req, res) {
		var docId = data.fnMongoId(req.params.docId);

		data.fnMongo(function(err, db) {
			if (err) {
				res.flash.message('error', err.message);
				res.redirect(data.pages.error_server.path);
				return;
			}

			db.collection('docs').find({ _id: docId }).nextObject(function(err, doc) {
				if (err) {
					res.render(data.pages.error_server.template, {
						title: 'Error Reading Document'
					});

					return;
				}

				res.render(page.template, {
					title: 'Document View',
					doc: doc,
					content: data.fnRedact(doc)
				});
			});
		});

	});

};
