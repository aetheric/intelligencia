module.exports = function(express, data) {
	var i18n = require('i18next');
	var mongoSync = require('i18next.mongoDb');

	express.use(i18n.handle);
	i18n.registerAppHelper(express);

	mongoSync.connect({
		resCollectionName: 'i18n',
		host: data.env.db.host,
		port: data.env.db.port,
		dbName: data.env.db.path,
		username: data.env.db.user,
		password: data.env.db.pass
	}, function() {
		i18n.backend(mongoSync);
		i18n.init();
	});

};