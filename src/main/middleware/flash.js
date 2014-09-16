module.exports = function flash() {
	console.log('Adding flash scope to middleware chain');

	function message(flash, type, text) {
		flash.message = {
			type: type,
			text: text
		};
	}

	return function(req, res, next) {
		var session = req.session;
		if (!session) {
			throw 'Flash scope requires a session to work!';
		}

		// Make sure the request has a flash object.
		res.locals.flash = req.flash = session.flash || {};
		var flash = session.flash = res.flash = {};

		flash.message = function(type, text) {
			message(flash, type, text);
		};

		return next();
	};
};