module.exports = function(express) {

	express.get('/auth/register', function(req, res) {
		if (req.subject.isAuthenticated()) {
			res.redirect('/app/user/dash');
			return;
		}

		res.render('auth_register', {
			title: 'Register'
		});
	});

};
