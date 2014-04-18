module.exports = function(express) {

	express.get('/app/user/dash', function(req, res) {
		res.render('user_dash', {
			title: 'User Dashboard'
		});
	});

};