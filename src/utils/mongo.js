module.exports = function(data) {
	var mongo = require('mongodb');
	var client = mongo.MongoClient;
	var format = require('format');

	var db = data.env.db;
	var dburi = format('mongodb://%s:%s@%s:%d/%s', db.user, db.pass, db.host, db.port, db.path);

	data.fnMongo = function(callback) {
		client.connect(dburi, callback);
	};

	data.fnMongoId = function(idString) {
		return new mongo.ObjectID(idString);
	};

};
