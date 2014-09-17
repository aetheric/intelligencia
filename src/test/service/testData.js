var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var _ = require('underscore');
var mongo = require('mongodb');

describe('the data service', function() {
	var data;
	var client;
	var expectedCalls;

	beforeEach(function() {
		expectedCalls = 0;
		data = proxyquire('../../main/service/data', {
			mongo: {
				client: client = {}
			}
		});
	});

	it('should be an object', function() {
		expect(data).to.exist;
		expect(data).to.be.an('object');
		expect(data).to.not.be.a('function');
	});

	describe('an init method', function() {

		beforeEach(function() {
			client.connect = sinon.spy();
		});

		it('should be a function', function() {
			expect(data).to.have.property('init');
			expect(data.init).to.be.a('function');
		});

		it('should return a promise', function() {
			var output = data.init({});
			expect(output).to.be.an('object');
			expect(output).to.have.property('then');
		});

		it('should connect to the database', function() {
			data.init({}).then(function() {
				sinon.assert.calledOnce(client.connect);
			});
		});

	});

	describe('a close method', function() {

		it('should be a function', function() {
			expect(data).to.have.property('close');
			expect(data.close).to.be.a('function');
		});

		it('should return a promise', function() {
			var output = data.close();
			expect(output).to.be.an('object');
			expect(output).to.have.property('then');
		});

		it('should close the current connection', function() {
			data.init({}).then(function() {
				data.close().then(function() {
					sinon.assert.calledOnce(client.close);
				});
			});
		});

	});

	describe('a method to get document details', function() {

		it('should be a function', function() {
			expect(data).to.have.property('getDocumentDetail');
			expect(data.getDocumentDetail).to.be.a('function');
		});

		it('should return a promise', function() {
			var output = data.getDocumentDetail(0);
			expect(output).to.be.an('object');
			expect(output).to.have.property('then');
		});

		it('should access the document collection', function() {
			data.getDocumentDetail(0).then(function(document, error) {
				sinon.assert.calledOnceWith(client.db.collection, 'docs');
			});
		});

		it('should find by the mongo-fied object id', function() {
			var documentId = 12;
			var mockCollection = {
				find: sinon.spy()
			};

			data.init({}).then(function(connection) {

				connection.collection = function() {
					return mockCollection;
				};

				data.getDocumentDetail(documentId).then(function() {
					sinon.assert.calledOnceWith(mockCollection.find, {
						_id: new mongo.ObjectId(documentId)
					});
				});
			});
		});

	});

});
