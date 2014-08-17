var expect = require('chai').expect;
var fs = require('fs');
var _ = require('underscore');

// Required to get access to String.format
require('../utils/utils')({});

describe('fnRedact(document, subject)', function() {
	var redact = require('../utils/redacter');

	describe('with simple input', function() {

		it('should leave a regular string of text alone', function() {
			var inputText = 'This is a string of normal input text with no fancy crap.';
			expect(redact(inputText, mockSubject(false))).to.equal(inputText);
		});

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

	var fileReadOptions = { encoding: 'utf-8' };

	describe('with complex input', function() {
		var complexInput = fs.readFileSync('./testRedacterInput.txt', fileReadOptions);

		it('should redact forbidden sections', function() {
			var complexOutput = fs.readFileSync('./testRedacterOutput.txt', fileReadOptions);
			expect(redact(complexInput, mockSubject(function(requiredClearance) {
				return requiredClearance === 'test:alpha';
			}))).to.equal(complexOutput)
		});

	});

});

function mockSubject(isPermitted) {
	return {

		isPermitted: function(requiredClearance, callback) {
			if (_.isFunction(isPermitted)) {
				return isPermitted(requiredClearance);
			} else if (_.isBoolean(isPermitted)) {
				callback(null, isPermitted);
			} else {
				callback(isPermitted, null);
			}
		}

	};
}