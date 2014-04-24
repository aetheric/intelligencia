module.exports(data) {
	var mongo = require('mongodb').MongoClient;

	mongo.connect('mongodb://127.0.0.1:27017/intelligencia', function(err, db) {
		if(err) throw err;
	}

}
