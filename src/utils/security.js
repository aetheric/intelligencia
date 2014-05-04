module.exports = function(express, data) {

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
		_.extend(response.flash, flashi || {});
		response.redirect(target);
	}

	express.use(function(req, res, next) {
		var session = getSession(req);
		var user = session.user;

		if (!user) {
			setError(res, 'Please sign-in to access the requested page.');
			return redirect(res, data.pages.auth_login.path, {
				redirect: req.path
			});
		}

		//TODO: Access checks against user.roles

	});

};
