module.exports = function() {
	var _ = require('underscore');

	var regex_newline = /(?:\r\n)|(?:\r)|(?:\n)/g;
	var redaction_char = '\u2588';
	var match_restrict_start = '[restrict ';
	var match_restrict_end = '[/restrict]';

	function lockWhitespace(input) {
		var output = input.trim();

		// Lock in all manual line-breaks
		output = output.replace(regex_newline, '<br/>');

		// Lock in all manual whitespace blocks.
		output = output.replace(/  /g, '&nbsp;&nbsp;');
		output = output.replace(/&nbsp; /g, '&nbsp;&nbsp;');

		return output;
	}

	return function(document, subject) {
		if (!document || !subject) {
			return null;
		}

		// Manual line-breaks
		var redacted = lockWhitespace(document);

		var sections = [];

		// Redaction
		for (var idx_target = 0; idx_target < redacted.length; ) {
			idx_target = redacted.indexOf(match_restrict_start, idx_target + 1);
			if (idx_target < 0) {
				break;
			}

			sections.unshift(idx_target);
		}

		_.each(sections, function(idx_restrict_start) {
			var idx_required_end = redacted.indexOf(']', idx_restrict_start);
			var idx_required_start = idx_restrict_start + match_restrict_start.length;

			var requiredClearances = redacted.substring(idx_required_start, idx_required_end).split(' ');

			// Mark whether the user does not possesses each clearance.
			_.each(requiredClearances, function(clearance, index) {
				subject.isPermitted(requiredClearances[index], function(err, permitted) {
					requiredClearances[index] = permitted;
				});
			});

			// If any of the clearances are marked as restricted, the whole thing is.
			var restricted = _.some(requiredClearances, function(clearance) {
				return !clearance;
			});

			var idx_restrict_end = redacted.indexOf(match_restrict_end, idx_required_end + 1);
			var section = redacted.substring(idx_required_end + 1, idx_restrict_end).trim();

			if (restricted) {
				section = section.replace(/[\S ]/g, redaction_char);
			}

			redacted
				= redacted.substring(0, idx_restrict_start)
				+ section
				+ redacted.substring(idx_restrict_end + match_restrict_end.length);
		});

		return redacted;
	}
}();
