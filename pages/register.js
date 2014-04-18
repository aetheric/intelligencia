module.exports = function(express) {

	express.get('/register', function(req, res) {
		res.render('register', {
			title: 'Register'
		});
	});

};
