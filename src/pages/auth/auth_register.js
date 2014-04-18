module.exports = function(express, data, page) {

	express.get(page.path + 'register', function(req, res) {
		if (req.subject.isAuthenticated()) {
			res.redirect('/app/user/dash');
			return;
		}

		res.render(page.template, {
			title: 'Register'
		});
	});

};
