module.exports = function(express) {

	express.get('/login', function(req, res) {
		res.render('login', {
			title: 'Sign-in',
		});
	});

};
