module.exports = function(express) {

	express.get('/app/user/detail/:userId', function(req, res) {
		res.render('user_detail', {
			title: 'User Detail'
		});
	});

};
