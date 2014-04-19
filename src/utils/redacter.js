module.exports = function(data) {
	var _ = require('underscore');

	var regex_newline = /\n/g;
	var redaction_char = '\u2588';
	var match_restrict_start = '[restrict ';
	var match_restrict_end = '[/restrict]';

	function redact(document, subject) {
		var redacted = document.content;
		if (!redacted || !subject) {
			return redacted;
		}

		// Manual line-breaks
		redacted = redacted.replace(regex_newline, '<br/>');

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

			var requiredClearance = redacted.substring(idx_required_start, idx_required_end).split(' ');

			// Mark whether the user possesses each clearance.
			_.each(requiredClearance, function(clearance, index) {
				subject.isPermitted(requiredClearance, function(err, permitted) {
					requiredClearance[index] = permitted;
				});
			});

			// If any of the clearances are marked as restricted, the whole thing is.
			var permitted = _.some(requiredClearance, function(clearance) {
				return !clearance;
			});

			var idx_restrict_end = redacted.indexOf(match_restrict_end, idx_required_end + 1);
			var section = redacted.substring(idx_required_end + 1, idx_restrict_end);

			if (permitted) {
				section = section.replace(/[\S ]/g, redaction_char);
			}

			redacted
				= redacted.substring(0, idx_restrict_start)
				+ section
				+ redacted.substring(idx_restrict_end + match_restrict_end.length);
		});

		return redacted;
	}

	data.fnRedact = redact;

};
