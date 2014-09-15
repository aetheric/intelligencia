var expect = require('chai').expect;
var fs = require('fs');
var _ = require('underscore');

// Required to get access to String.format
require('../utils/utils')({});

describe('fnRedact(document, subject)', function() {
	var redact = require('../utils/redacter');

	it('should leave a regular string of text alone', function() {
		var inputText = 'This is a string of normal input text with no fancy crap.';
		expect(redact(inputText, mockSubject(false))).to.equal(inputText);
	});

	describe('dealing with line breaks', function() {

		var testLineBreakText = 'This is a string of text with a{}line break in it.';

		it('should replace windows line breaks with <br/>', function() {
			var inputText = testLineBreakText.format('\r\n');
			var outputText = testLineBreakText.format('<br/>');
			expect(redact(inputText, mockSubject(false))).to.equal(outputText);
		});

		it('should replace unix line breaks with <br/>', function() {
			var inputText = testLineBreakText.format('\n');
			var outputText = testLineBreakText.format('<br/>');
			expect(redact(inputText, mockSubject(false))).to.equal(outputText);
		});

		it('should replace old mac line breaks with <br/>', function() {
			var inputText = testLineBreakText.format('\r');
			var outputText = testLineBreakText.format('<br/>');
			expect(redact(inputText, mockSubject(false))).to.equal(outputText);
		});

	});

	describe('dealing with complex blocks', function() {
		var input_begin = 'This is a section of text ';
		var input_middle = '[restrict test:alpha] that has a secure block  [/restrict]';
		var input_end = ' in it.';
		var input = input_begin + input_middle + input_end;

		it('should leave unrestricted content alone', function() {
			var redacted = redact(input, mockSubject(true));
			expect(redacted).to.equal(input_begin
				+ '[restrict test:alpha] that has a secure block&nbsp;&nbsp;[/restrict]' + input_end);
		});

		it ('should redact content of restricted blocks', function() {
			var expectedOutput = input_begin + redactedContent(input_middle.length) + input_end;
			var redacted = redact(input, mockSubject(false));
			expect(redacted).to.equal(expectedOutput);
		})

	});

});

function mockSubject(isPermitted) {
	return {

		/**
		 *
		 * @param requiredClearance
		 * @param callback function(err, permitted)
		 * @returns {*}
		 */
		isPermitted: function(requiredClearance, callback) {
			try {
				if (_.isFunction(isPermitted)) {
					return callback(null, isPermitted(requiredClearance));

				} else if (_.isString(isPermitted)) {
					return callback(null, requiredClearance === isPermitted);

				} else if (_.isBoolean(isPermitted)) {
					return callback(null, isPermitted);

				} else {
					return callback(isPermitted, null);

				}
			} catch (error) {
				return callback(error);
			}
		}

	};
}

function redactedContent(num) {
	var output = '';
	for (var i = 0; i < num; i++) {
		output += '█';
	}
	return output;
}
