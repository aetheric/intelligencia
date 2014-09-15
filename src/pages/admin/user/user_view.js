module.exports = function(express, data, page) {

	express.get(page.path + '/:userId', function(req, res) {
		var userId = data.fnMongoId(req.params.userId);

		data.fnMongo(function(err, db) {
			if (data.fnHandleError(res, err)) return;

			db.collection('users').find({ _id: userId }).nextObject(function(err, user) {
				if (data.fnHandleError(res, err)) return;

				//TODO: Handle missing user.

				res.render(page.template, {
					title: 'User Detail',
					user: user
				});
			});
		});
	});

};
