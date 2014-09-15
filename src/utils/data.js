module.exports = function() {
	var mongo = require('mongodb');
	var client = mongo.MongoClient;
	var format = require('format');

	var connection;

	return {

		init: function(config) {
			connection = format('mongodb://%s:%s@%s:%d/%s',
				config.user || 'mongo',
				config.pass || 'mongo',
				config.host || 'localhost',
				config.port,
				config.path
			);
		},

		getDocumentDetail: function(docId, callback) {
			client.connect(connection, function(err, db) {
				if (err) return callback(err);

				db.collection('docs').find({ _id: docId }).nextObject(callback);
			});
		}

	};

}();
