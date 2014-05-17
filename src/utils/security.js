module.exports = function(express, data) {
	var _ = require('underscore');

	function getSession(request) {
		var session = request.session;
		if (session) {
			return session;
		}

		throw "Security requires a session to work."
	}

	function setError(response, message) {
		response.flash.message = {
			type: 'error',
			text: message
		};
	}

	function redirect(response, target, flash) {
		_.extend(response.flash, flash || {});
		response.redirect(target);
	}

	express.use(function(req, res, next) {
		var session = getSession(req);
		var user = session.user;

		var auth = res.locals.auth = {
			isValid: false,
			isAdmin: false
		};

		if (/^\/auth/g.test(req.path)) {
			return next();
		}

		if (!user) {
			setError(res, 'Please sign-in to access the requested page.');
			return redirect(res, data.pages.auth_login.path, {
				redirect: req.path
			});
		}

		_.extend(auth, {
			isValid: true,
			isAdmin: _.contains(user.roles, 'admin')
		});

		if (!_.contains(user.roles, 'user')) {
			return res.redirect(data.pages.auth_unverified.path);
		}

		//TODO: Access checks against user.roles

		return next();
	});

};
