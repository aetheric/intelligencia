module.exports = function(express) {

	express.get('/register', function(req, res) {
		if (req.status.isAuthenticated()) {
			res.redirect('/app/user/dash');
			return;
		}

		res.render('register', {
			title: 'Register'
		});
	});

};
