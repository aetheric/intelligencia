module.exports = function(data) {

	function redact(document) {
		var redacted = document.content;

		redacted = redacted.replace(/\n/g, '<br/>');

		return redacted;
	}

	data.fnRedact = redact;

};