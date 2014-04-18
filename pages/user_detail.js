module.exports = function(express) {

	express.get('/user/detail/:userId', function(req, res) {
		res.render('user_detail', {
			title: 'User Detail'
		});
	});

};
