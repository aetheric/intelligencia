module.exports = function(express) {

	express.get('/user/dash', function(req, res) {
		res.render('user_dash', {
			title: 'User Dashboard'
		});
	});

};