module.exports = function(express, data) {
	var i18n = require('i18next');
	var mongoSync = require('i18next.mongoDb');

	var dataService = require('../service/data');

	express.use(i18n.handle);
	i18n.registerAppHelper(express);

	var config = dataService.getConfig();

	mongoSync.connect({
		resCollectionName: 'i18n',
		host: config.host,
		port: config.port,
		dbName: config.path,
		username: config.user,
		password: config.pass
	}, function() {
		i18n.backend(mongoSync);
		i18n.init();
	});

};
