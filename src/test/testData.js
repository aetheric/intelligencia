var expect = require('chai').expect;
var data = require('../utils/data');

describe('the data service', function() {

	describe('an init method', function() {

		it('should exist', function() {
			expect(data).to.have.property('init');
			expect(data.init).to.be.a('function');
		});

		it('should have stuff', function() {
			//
		})

	});

	describe('a close method', function() {

		it('should exist', function() {
			expect(data).to.have.property('close');
			expect(data.close).to.be.a('function');
		});

	});

	describe('a method to get document details', function() {

		it('should exist', function() {
			expect(data).to.have.property('getDocumentDetail');
			expect(data.getDocumentDetail).to.be.a('function');
		});

	});

});
