module.exports = function() {
	var _ = require('underscore');
	var Promise = require('promise');

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
		if (_.isString(length)) {
			return mask(length.length);
		}

		var output = '';

		for (var i = 0; i < length; i++) {
			output += '█';
		}

		return output;
	}

	return {

		init: function() {
		},

		redact: function (document, predicate) {
			return new Promise(function(resolve, reject) {
				if (!document) return reject(new Error('Document is missing'));
				if (!predicate) return reject(new Error('Predicate is missing'));
				if (!_.isFunction(predicate)) {
					return reject(new Error('Predicate is not a function.'));
				}

				var redacted = document;
				var groups;

				while (groups = regex_restrict.exec(redacted)) {
					var requiredRoles = groups[1].split(',');

					var restricted = _.reduce(requiredRoles, function (restricted, requiredRole) {
						return restricted || predicate(requiredRole);
					}, false);

					if (restricted) {
						var content_full = groups[0];
						redacted = redacted.replace(content_full, mask(content_full.length));
					}

				}

				return resolve(lockWhitespace(redacted));

			});
		}

	}
}();
