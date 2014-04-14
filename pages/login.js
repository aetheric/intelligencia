module.exports = function(express) {
	var login = require('./../data').loginClassic;

	express.get('/login', function(req, res) {
		res.render('login', {
			title: 'Log-in',
			error: req.query.error,
			user: req.query.user
		});
	});
	
	express.post('/login', function(req, res) {

		var user = req.body.username;
		if (!user) {
			res.redirect('/login?error=user');
			return;
		}

		var pass = req.body.password;
		if (!pass) {
			res.redirect('/login?error=pass&user=' + user);
			return;
		}

		var id = login(user, pass);

		if (!id) {
			res.redirect('/login?error=cred&user=' + user);
			return;
		}
		
		res.redirect('/app');
	});

};