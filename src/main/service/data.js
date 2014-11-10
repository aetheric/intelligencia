module.exports = function() {
	var mongo = require('mongodb');
	var client = mongo.MongoClient;
	var format = require('format');
	var Promise = require('promise');
	var _ = require('underscore');

	var COLLECTION_USERS = 'users';
	var COLLECTION_DOCS = 'docs';
	var COLLECTION_MAIL = 'mail';
	var COLLECTION_RECOVERY = 'recovery';
	var COLLECTION_INTEL = 'info';

	var settings;
	var connection = {
		value: null,
		promise: null,
		resolve: null,
		reject: null
	};


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

			var promise = new Promise(function(resolve, reject) {

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

				client.connect(connection_url, function(error, conn) {

					if (error) {
						reject(error);
						return;
					}

					if (!conn) {
						reject(new Error('Connection failed to establish!'));
						return;
					}

					connection.value = conn;
					resolve(connection.value);

				});

			});

			promise.then(function(conn) {
				log.info('Mongo database start-up succeeded!');

				if (connection.promise) {
					connection.resolve(conn);
				}
			});

			promise.catch(function(error) {
				log.info('Mongo database start-up failed!');

				if (connection.promise) {
					connection.reject(error);
				}
			});

			return promise;
		},

		getConfig: function() {
			return _.extend({}, settings);
		},

		getConnection: function() {
			if (!connection.promise) {
				if (connection.value) {
					connection.promise = Promise.resolve(connection.value);
				} else {
					connection.promise = new Promise(function(resolve, reject) {
						connection.resolve = resolve;
						connection.reject = reject;
					});
				}
			}

			return connection.promise;
		},

		close: function() {
			return new Promise(function(resolve, reject) {

				if (!connection) {
					reject(new Error('Connection either already closed, or uninitialised.'));
					return;
				}

				try {
					connection.close();
				} catch (error) {
					return reject(error);
				}

				connection = null;
				resolve();

			});
		},

		getUserList: function() {
			return new Promise(function(resolve, reject) {

				service.getConnection().then(function(connection) {
					try {
						connection
							.collection(COLLECTION_USERS)
							.find()
							.toArray(callback(resolve, reject));
					} catch (error) {
						return reject(error);
					}
				}, reject);

			});
		},

		getUserById: function(userId) {
			if (!userId) return Promise.reject(new Error('No user id has been provided!'));
			return service.getUser(singleton('_id', mongoId(userId)));
		},

		getUserByUsername: function(username) {
			if (!username) return Promise.reject(new Error('No username has been provided!'));
			return service.getUser(singleton('username', username));
		},

		getUserByEmail: function(email) {
			if (!email) return Promise.reject(new Error('No email has been provided!'));
			return service.getUser(singleton('email', email));
		},

		getUser: function(criteria) {
			return new Promise(function(resolve, reject) {
				if (!criteria) return reject(new Error('No search criteria provided!'));

				service.getConnection().then(function(connection) {
					try {
						connection
							.collection(COLLECTION_USERS)
							.find(criteria)
							.nextObject(callback(resolve, reject));
					} catch (error) {
						reject(error);
					}
				}, reject);

			});
		},

		addUser: function(username, password, email) {
			return new Promise(function(resolve, reject) {
				if (!username) return reject(new Error('No username has been provided'));
				if (!password) return reject(new Error('No password has been provided'));
				if (!email) return reject(new Error('No email address has been provided'));

				var item = {
					username: username,
					password: password,
					email: email
				};

				var options = {
					safe: true
				};

				service.getConnection().then(function(connection) {
					try {
						connection
							.collection(COLLECTION_USERS)
							.insert(item, options, callback(resolve, reject));
					} catch (error) {
						reject(error);
					}
				}, reject);

			});
		},

		updateUser: function(user) {
			return new Promise(function(resolve, reject) {
				if (!user) return reject(new Error('No user has been provided!'));

				service.getConnection().then(function(connection) {
					try {
						connection
							.collection(COLLECTION_USERS)
							.update(user, callback(resolve, reject));
					} catch (error) {
						reject(error);
					}
				}, reject);

			});
		},

		addRecovery: function(userId, email, code) {
			return new Promise(function(resolve, reject) {
				if (!userId) return reject(new Error('No user id has been provided'));
				if (!email) return reject(new Error('No email address has been provided'));
				if (!code) return reject(new Error('No recovery code has been provided.'));

				var item = {
					userId: userId,
					email: email,
					code: code
				};

				var options = {
					safe: true
				};

				service.getConnection().then(function(connection) {
					try {
						connection
							.collection(COLLECTION_RECOVERY)
							.insert(item, options, callback(resolve, reject));
					} catch (error) {
						reject(error);
					}
				}, reject);

			});
		},

		getRecoveryList: function() {
			return new Promise(function(resolve, reject) {

				service.getConnection().then(function(connection) {
					try {
						connection
							.collection(COLLECTION_RECOVERY)
							.find()
							.toArray(callback(resolve, reject));
					} catch (error) {
						reject(error);
					}
				});

			});
		},

		getRecoveryByEmailAndCode: function(email, code) {
			return new Promise(function(resolve, reject) {
				if (!email) return reject(new Error('No email has been provided!'));
				if (!code) return reject(new Error('No code has been provided!'));

				var query = {
					email: email,
					code: code
				};

				service.getConnection().then(function(connection) {
					try {
						connection
							.collection(COLLECTION_RECOVERY)
							.find(query)
							.nextObject(callback(resolve, reject));
					} catch (error) {
						reject(error);
					}
				});

			});
		},

		addIntel: function(username, content) {
			return new Promise(function(resolve, reject) {
				if (!username) return reject(new Error('No username has been provided!'));
				if (!content) return reject(new Error('No content has been provided!'));

				var item = {
					username: username,
					content: content,
					submitted: new Date()
				};

				var options = {
					safe: true
				};

				service.getConnection().then(function(connection) {
					try {
						connection
							.collection(COLLECTION_INTEL)
							.insert(item, options, callback(resolve, reject));
					} catch (error) {
						reject(error);
					}
				});

			});
		},

		getDocumentList: function() {
			return new Promise(function(resolve, reject) {

				service.getConnection().then(function(connection) {
					try {
						connection
							.collection(COLLECTION_DOCS)
							.find()
							.toArray(callback(resolve, reject));
					} catch (error) {
						reject(error);
					}
				});

			});
		},

		getDocumentById: function(docId) {
			return new Promise(function(resolve, reject) {
				if (!docId) return reject(new Error('No document id has been provided.'));

				service.getConnection().then(function(connection) {
					try {
						connection
							.collection(COLLECTION_DOCS)
							.find(singleton('_id', mongoId(docId)))
							.nextObject(callback(resolve, reject));
					} catch (error) {
						reject(error);
					}
				});

			});
		},

		getMailTemplateByName: function(templateName) {
			return new Promise(function(resolve, reject) {
				if (!templateName) return reject(new Error('Template name is not valid'));

				service.getConnection().then(function(connection) {
					try {
						connection
							.collection(COLLECTION_MAIL)
							.find(singleton('name', templateName))
							.nextObject(callback(resolve, reject));
					} catch (error) {
						reject(error);
					}
				});

			});
		}

	};

	return service;

}();
