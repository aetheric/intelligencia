module.exports = function(express) {

	express.get('/user/list', function(req, res) {
		res.render('user_list', {
			title: 'User List'
		});
	});

};
