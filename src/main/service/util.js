module.exports = function(){

	return $this = {

		/**
		 * This function allows for single-line handling of critical error conditions. Should be used in code as follows:
		 * <code>if (data.fnHandleError(res, err)) return;</code>. Will log an error stacktrace, and format a message for
		 * the user, as well as redirecting the current response to the server error page.
		 * @param response The response object for the current request.
		 * @param redirect Where to send the user after processing the error.
		 * @returns {function} If an error was thrown, true. Otherwise false.
		 */
		createErrorHandler: function(response, redirect) {
			return function(error) {
				if (!error) return false;

				// log the error to the console.
				console.error(error.stack);

				// Create a formatted error message.
				var message = error.code ? ' ({})'.format(error.code) : '';
				message = '{}{}: {}'.format(error.name, message, error.message);

				// Redirect to server error page with message.
				response.flash.message('error', message);
				response.redirect(redirect);

				return true;
			};
		}

	}

}();
