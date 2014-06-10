module.exports = function(express, data, page) {

	express.get(page.path, function(req, res) {
		data.fnMongo(function(err, db) {
			if (data.fnHandleError(res, err)) return;

			db.collection('docs').find().toArray(function(err, items) {
				if (data.fnHandleError(res, err)) return;

				res.render(page.template, {
					title: 'Document List',
					docs: items
				});
			});
		});

	});
};
