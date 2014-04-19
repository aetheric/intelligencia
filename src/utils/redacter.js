module.exports = function(data) {

	function redact(document) {
		var redacted = document.content;

		// Paragraphs
		redacted = redacted.replace(/\n([.\n]+?)\n\n/g, '\1');

		// Manual line-breaks
		redacted = redacted.replace(/\n/g, '<br/>');

		// Redaction
		redacted = redacted.replace(/\[.+?\]([.\n]*?)\w([.\n]*?)\[\/\]/g, '\1*\2');

		return redacted;
	}

	data.fnRedact = redact;

};
