module.exports = function() {
	var mongo = require('mongodb');
	var client = mongo.MongoClient;
	var format = require('format');

	var connection;

	return {

		init: function(config) {
			var connection_url = format('mongodb://%s:%s@%s:%d/%s',
				config.user || 'mongo',
				config.pass || 'mongo',
				config.host || 'localhost',
				config.port,
				config.path
			);

			client.connect(connection_url, function(err, db) {
				if (err) throw err;
				connection = db;
			});
		},

		close: function() {
			if (connection) {
				connection.close();
			}
		},

		getDocumentDetail: function(docId, callback) {
			connection.collection('docs').find({ _id: docId }).nextObject(callback);
		}

	};

}();
