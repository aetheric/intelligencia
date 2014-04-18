module.exports = function(data) {

	function redact(document) {
		return document.content;
	}

	data.fnRedact = redact;

};