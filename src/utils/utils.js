module.exports = function (data) {
	var _ = require('underscore');

	String.prototype.stripSuffix = function (suffix, startFrom) {
		var start = 0;
		if (startFrom) {
			var idx = this.indexOf(startFrom);
			if (idx >= 0) {
				start = idx + startFrom.length;
			}
		}

		return this.substring(start, this.lastIndexOf(suffix));
	};

	String.prototype.remove = function (regex) {
		return this.replace(regex, '');
	}

};