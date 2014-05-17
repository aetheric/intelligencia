module.exports = function(express, data, page) {

	express.get(page.path, function(req, res) {
		data.fnMongo(function(err, db) {
			if (err) {
				res.flash.message('error', err.message);
				res.redirect(data.pages.error_server.path);
				return;
			}

			db.collection('docs').find().toArray(function(err, items) {
				if (err) {
					res.render(data.pages.error_server.template, {
						title: 'Error listing documents'
					});

					return;
				}

				res.render(page.template, {
					title: 'Document List',
					docs: items
				});
			});
		});

	});
};
