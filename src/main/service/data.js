module.exports = function() {
	var mongo = require('mongodb');
	var client = mongo.MongoClient;
	var format = require('format');
	var Promise = require('promise');

	var COLLECTION_USERS = 'users';
	var COLLECTION_DOCS = 'docs';
	var COLLECTION_MAIL = 'mail';
	var COLLECTION_RECOVERY = 'recovery';
	var COLLECTION_INTEL = 'info';

	var connection;
	var settings;

	function mongoId(objectId) {
		return new mongo.ObjectID(objectId);
	}

	function callback(resolve, reject) {
		return function(error, data) {
			return error
				? reject(error)
				: resolve(data);
		}
	}

	function singleton(key, value) {
		var singleton = {};
		singleton[key] = value;
		return singleton;
	}

	var service = {

		init: function(config) {
			return new Promise(function(resolve, reject) {

				settings = _.defaults(config, {
					user: 'mongo',
					pass: 'mongo',
					host: 'localhost',
					port: 27017
				});

				var connection_url = format('mongodb://%s:%s@%s:%d/%s',
					settings.user,
					settings.pass,
					settings.host,
					settings.port,
					settings.path
				);

				client.connect(connection_url, callback(resolve, reject));
			}).then(function(conn) {
				connection = conn;
			});
		},

		getConfig: function() {
			return _.extend({}, settings);
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

		getUserList: function() {
			return new Promise(function(resolve, reject) {
				if (!connection) return reject('No connection has been established');

				try {
					connection
						.collection(COLLECTION_USERS)
						.find()
						.toArray(callback(resolve, reject));
				} catch (error) {
					return reject(error);
				}
			});
		},

		getUserById: function(userId) {
			if (!userId) return Promise.reject('No user id has been provided!');
			return service.getUser(singleton('_id', mongoId(userId)));
		},

		getUserByUsername: function(username) {
			if (!username) return Promise.reject('No username has been provided!');
			return service.getUser(singleton('username', username));
		},

		getUserByEmail: function(email) {
			if (!email) return Promise.reject('No email has been provided!');
			return service.getUser(singleton('email', email));
		},

		getUser: function(criteria) {
			return new Promise(function(resolve, reject) {
				if (!criteria) return reject('No search criteria provided!');
				if (!connection) return reject('No connection has been established!');

				try {
					connection
						.collection(COLLECTION_USERS)
						.find(criteria)
						.nextObject(callback(resolve, reject));
				} catch (error) {
					reject(error);
				}
			});
		},

		addUser: function(username, password, email) {
			return new Promise(function(resolve, reject) {
				if (!username) return reject('No username has been provided');
				if (!password) return reject('No password has been provided');
				if (!email) return reject('No email address has been provided');
				if (!connection) return reject('No connection has been established!');

				var item = {
					username: username,
					password: password,
					email: email
				};

				var options = {
					safe: true
				};

				try {
					connection
						.collection(COLLECTION_USERS)
						.insert(item, options, callback(resolve, reject));
				} catch (error) {
					reject(error);
				}
			});
		},

		updateUser: function(user) {
			return new Promise(function(resolve, reject) {
				if (!user) return reject('No user has been provided!');
				if (!connection) return reject('No connection has been established!');

				try {
					connection
						.collection(COLLECTION_USERS)
						.update(user, callback(resolve, reject));
				} catch (error) {
					reject(error);
				}
			});
		},

		addRecovery: function(userId, email, code) {
			return new Promise(function(resolve, reject) {
				if (!userId) return reject('No user id has been provided');
				if (!email) return reject('No email address has been provided');
				if (!code) return reject('No recovery code has been provided.');
				if (!connection) return reject('No connection has been established!');

				var item = {
					userId: userId,
					email: email,
					code: code
				};

				var options = {
					safe: true
				};

				try {
					connection
						.collection(COLLECTION_RECOVERY)
						.insert(item, options, callback(resolve, reject));
				} catch (error) {
					reject(error);
				}
			});
		},

		getRecoveryList: function() {
			return new Promise(function(resolve, reject) {
				if (!connection) return reject('No connection has been established!');

				try {
					connection
						.collection(COLLECTION_RECOVERY)
						.find()
						.toArray(callback(resolve, reject));
				} catch (error) {
					reject(error);
				}
			});
		},

		getRecoveryByEmailAndCode: function(email, code) {
			return new Promise(function(resolve, reject) {
				if (!email) return reject('No email has been provided!');
				if (!code) return reject('No code has been provided!');
				if (!connection) return reject('No connection has been established!');

				var query = {
					email: email,
					code: code
				};

				try {
					connection
						.collection(COLLECTION_RECOVERY)
						.find(query)
						.nextObject(callback(resolve, reject));
				} catch (error) {
					reject(error);
				}
			});
		},

		addIntel: function(username, content) {
			return new Promise(function(resolve, reject) {
				if (!username) return reject('No username has been provided!');
				if (!content) return reject('No content has been provided!');
				if (!connection) return reject('No connection has been established!');

				var item = {
					username: username,
					content: content,
					submitted: new Date()
				};

				var options = {
					safe: true
				};

				try {
					connection
						.collection(COLLECTION_INTEL)
						.insert(item, options, callback(resolve, reject));
				} catch (error) {
					reject(error);
				}
			});
		},

		getDocumentList: function() {
			return new Promise(function(resolve, reject) {
				if (!connection) return reject('No connection has been established!');

				try {
					connection
						.collection(COLLECTION_DOCS)
						.find()
						.toArray(callback(resolve, reject));
				} catch (error) {
					reject(error);
				}
			});
		},

		getDocumentById: function(docId) {
			return new Promise(function(resolve, reject) {
				if (!docId) return reject('No document id has been provided.');
				if (!connection) return reject('No connection has been established!');

				try {
					connection
						.collection(COLLECTION_DOCS)
						.find(singleton('_id', mongoId(docId)))
						.nextObject(callback(resolve, reject));
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
						.collection(COLLECTION_MAIL)
						.find(singleton('name', templateName))
						.nextObject(callback(resolve, reject));
				} catch (error) {
					reject(error);
				}
			});
		}

	};

	return service;

}();
