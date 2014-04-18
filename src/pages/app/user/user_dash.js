module.exports = function(express, fnDir, path) {

	express.get(path + 'dash', function(req, res) {
		res.render('user_dash', {
			title: 'User Dashboard'
		});
	});

};