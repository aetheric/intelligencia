module.exports = function() {
	var mongo = require('mongodb');
	var client = mongo.MongoClient;
	var format = require('format');
	var Promise = require('promise');

	var connection;

	function mongoId(objectId) {
		return new mongo.ObjectID(objectId);
	}

	return {

		init: function(config) {
			return new Promise(function(resolve, reject) {
				var connection_url = format('mongodb://%s:%s@%s:%d/%s',
					config.user || 'mongo',
					config.pass || 'mongo',
					config.host || 'localhost',
					config.port,
					config.path
				);

				client.connect(connection_url, function(error, database) {
					return error
						? reject(error)
						: resolve(connection = database);
				});
			});
		},

		close: function() {
			return new Promise(function(resolve, reject) {
				if (connection) {
					try {
						connection.close();
					} catch (error) {
						return reject(error);
					}

					connection = null;
					return resolve();
				}

				return reject('Connection either already closed, or uninitialised.');
			});
		},

		getDocumentDetail: function(docId) {
			return new Promise(function(resolve, reject) {
				if (!docId) return reject('Document id is not valid');
				if (!connection) return reject('No connection has been established');

				try {
					connection
						.collection('docs')
						.find({
							_id: mongoId(docId)
						}).nextObject(function (error, document) {
							return error ? reject(error) : resolve(document);
						});
				} catch (error) {
					reject(error);
				}
			});
		},

		getMailTemplateByName: function(templateName) {
			return new Promise(function(resolve, reject) {
				if (!templateName) return reject('Template name is not valid');
				if (!connection) return reject('No connection has been established');

				try {
					connection
						.collection('mail')
						.find({
							name: templateName
						}).nextObject(function(error, mailTemplate) {
							return error ? reject(error) : resolve(mailTemplate);
						});
				} catch (error) {
					reject(error);
				}
			});
		}

	};

}();
