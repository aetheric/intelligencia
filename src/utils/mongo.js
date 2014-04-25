module.exports = function(data) {
	var mongo = require('mongodb');
	var client = mongo.MongoClient;
	var format = require('format');

	var db = {
		user: process.env.DB_USER || 'intelligencia',
		pass: process.env.DB_PASS || 'notpassword',
		host: process.env.DB_HOST || 'oceanic.mongohq.com',
		port: process.env.DB_PORT || '10096',
		path: process.env.DB_PATH || 'app24119285'
	};

	var dburi = format('mongodb://%s:%s@%s:%d/%s', db.user, db.pass, db.host, db.port, db.path);

	data.fnMongo = function(callback) {
		client.connect(dburi, function(err, db) {
			if(err) throw err;
			callback(db);
		});
	};

	data.fnMongoId = function(idString) {
		return new mongo.ObjectID(idString);
	};

};
