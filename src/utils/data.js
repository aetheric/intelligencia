module.exports = function() {
	var mongo = require('mongodb');
	var client = mongo.MongoClient;
	var format = require('format');

	var connection_url;
	var connection;

	function getConnection() {
		if (!connection) {
			client.connect(connection_url, function(err, db) {
				if (err) throw err;
				connection = db;
			});
		}

		return connection;
	}

	return {

		init: function(config) {
			connection_url = format('mongodb://%s:%s@%s:%d/%s',
				config.user || 'mongo',
				config.pass || 'mongo',
				config.host || 'localhost',
				config.port,
				config.path
			);
		},

		close: function() {
			if (connection) {
				connection.close();
			}
		},

		getDocumentDetail: function(docId, callback) {
			getConnection().collection('docs').find({ _id: docId }).nextObject(callback);
		}

	};

}();
