module.exports = function (data) {
	var _ = require('underscore');

	String.prototype.stripSuffix = function(suffix, startFrom) {
		var start = 0;
		if (startFrom) {
			var idx = this.indexOf(startFrom);
			if (idx >= 0) {
				start = idx + startFrom.length;
			}
		}

		return this.substring(start, this.lastIndexOf(suffix));
	};

	String.prototype.remove = function(regex) {
		return this.replace(regex, '');
	};

	var formatRegex = /\{\}/;
	String.prototype.format = function() {
		return _.reduce(arguments, function(memo, argument) {
			return memo.replace(formatRegex, argument);
		}, this);
	};

	/**
	 * This function allows for single-line handling of critical error conditions. Should be used in code as follows:
	 * <code>if (data.fnHandleError(res, err)) return;</code>. Will log an error stacktrace, and format a message for
	 * the user, as well as redirecting the current response to the server error page.
	 * @param res The response object for the current request.
	 * @param error The error that may or may not have been thrown.
	 * @returns {boolean} If an error was thrown, true. Otherwise false.
	 */
	data.fnHandleError = function(res, error) {
		if (!error) return false;

		// log the error to the console.
		console.error(error.stack);

		// Create a formatted error message.
		var message = error.code ? ' ({})'.format(error.code) : '';
		message = '{}{}: {}'.format(error.name, message, error.message);

		// Redirect to server error page with message.
		res.flash.message('error', message);
		res.redirect(data.pages.error_server.path);

		return true;
	}

};