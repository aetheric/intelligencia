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
		var input = 'This is a section of text [restrict test:alpha] that has a secure block  [/restrict] in it.';

		it('should strip out whitespace around visible secure blocks', function() {
			var expectedOutput = 'This is a section of text that has a secure block in it.';
			var redacted = redact(input, mockSubject(true));
			expect(redacted).to.equal(expectedOutput);
		});

		it ('should strip out whitespace around redacted secure blocks', function() {
			var expectedOutput = 'This is a section of text ███████████████████████ in it.';
			var redacted = redact(input, mockSubject(false));
			expect(redacted).to.equal(expectedOutput);
		})

	});

	describe('with file input and output', function() {
		var fileReadOptions = { encoding: 'utf-8' };
		var complexInput = fs.readFileSync('./testRedacterInput.txt', fileReadOptions);

		it('should redact forbidden sections', function() {
			var complexOutput = fs.readFileSync('./testRedacterOutput.txt', fileReadOptions);
			var redacted = redact(complexInput, mockSubject('test:alpha'));
			expect(redacted).to.equal(complexOutput)
		});

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