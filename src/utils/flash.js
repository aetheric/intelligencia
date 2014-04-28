module.exports = function flash() {
	console.log('Adding flash scope to middleware chain');

	return function(req, res, next) {
		var session = req.session;
		if (!session) {
			throw 'Flash scope requires a session to work!';
		}

		// Make sure the request has a flash object.
		res.locals.flash = req.flash = session.flash || {};
		session.flash = res.flash = {};

		next();
	};
};