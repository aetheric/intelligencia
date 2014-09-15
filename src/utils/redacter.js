module.exports = function() {
	var _ = require('underscore');

	var regex_newline = /(?:\r\n)|(?:\r)|(?:\n)/g;
	var regex_restrict = /\[restrict ([\w:]+?)\]([\s\S]+?)\[\/restrict\]/g;

	function lockWhitespace(input) {
		var output = input.trim();

		// Lock in all manual line-breaks
		output = output.replace(regex_newline, '<br/>');

		// Lock in all manual whitespace blocks.
		output = output.replace(/  /g, '&nbsp;&nbsp;');
		output = output.replace(/&nbsp; /g, '&nbsp;&nbsp;');

		return output;
	}

	function mask(length) {
		var output = '';

		for (var i = 0; i < length; i++) {
			output += '█';
		}

		return output;
	}

	return function(document, subject) {
		if (!document || !subject) {
			return null;
		}

		// Manual line-breaks
		var redacted = document;
		var groups;

		while ( groups = regex_restrict.exec(redacted) ) {
			var requiredRoles = groups[1].split(',');

			var restricted = _.reduce(requiredRoles, function(restricted, requiredRole) {
				return restricted || subject.isPermitted(requiredRole, function(err, permitted) {
					if (err || !permitted) {
						return true;
					}
				});
			}, false);

			if (restricted) {
				var content_full = groups[0];
				redacted = redacted.replace(content_full, mask(content_full.length));
			}

		}

		return lockWhitespace(redacted);
	}
}();
