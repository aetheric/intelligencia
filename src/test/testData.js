var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var _ = require('underscore');

describe('the data service', function() {
	var data;
	var client;

	beforeEach(function() {
		data = proxyquire('../utils/data', {
			mongo: {
				client: client = {
					connect: sinon.spy(),
					open: sinon.spy(),
					close: sinon.spy(),
					db: sinon.spy()
				}
			}
		});
	});

	it('should be an object', function() {
		expect(data).to.exist;
		expect(data).to.be.an('object');
		expect(data).to.not.be.a('function');
	});

	describe('an init method', function() {

		it('should be a function', function() {
			expect(data).to.have.property('init');
			expect(data.init).to.be.a('function');
			expect(data.init()).to.be.a('Promise');
		});

		it('should connect to the database', function() {
			data.init({});
			sinon.assert.calledOnce(client.connect);
		});

	});

	describe('a close method', function() {

		it('should be a function', function() {
			expect(data).to.have.property('close');
			expect(data.close).to.be.a('function');
			expect(data.close()).to.be.a('Promise');
		});

		it('should close the current connection', function() {
			data.close();
			sinon.assert.calledOnce(client.close);
		});

	});

	describe('a method to get document details', function() {

		it('should be a function', function() {
			expect(data).to.have.property('getDocumentDetail');
			expect(data.getDocumentDetail).to.be.a('function');
			expect(data.getDocumentDetail(0)).to.be.a('Promise');
		});

		it('should access the document collection', function() {
			data.getDocumentDetail(0).then(function(document, error) {
				sinon.assert.calledOnceWith(client.db.collection, 'docs');
			});
		});

	});

});
