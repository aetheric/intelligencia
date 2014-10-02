module.exports = function () {
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

};
