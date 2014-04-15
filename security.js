module.exports = function(express) {
	var fs = require('fs');

	var security = require('security-middleware');
	var utils = require('security-middleware/lib/security.js');

	var inMemoryStore = utils.inMemoryStore;
	var credentialsMatcher = utils.sha256CredentialsMatcher;

	var defaultPwd = credentialsMatcher.encrypt('changeit');

	// Set up all the roles.
	var codeDir = __dirname + '/data/codes';
	fs.readdir(codeDir, function(err, files) {
		err && throw err;

		for (var i = 0; i < files.length; i++) {
			!files[i].match(/\.json$/) && continue;

			var fileName = codeDir + '/' + file;
			fs.readFile(fileName, function(err, document) {
				err && throw err;

				var code = JSON.parse(document);
				var privileges = [];

				var codeId = files[i].substring(0, files[i].lastIndexOf('.json'));
				for (int j = 0; j < code.clearance.length; j++) {
					var clearance = code.clearances[j];
					privileges.push(clearance);

					inMemoryStore.storeRole({
						name: clearance,
						privileges: privileges
					});
				}
			});
		}
	});

	// Set up all the users
	var userDir = __dirname + '/data/users';
	fs.readdir(userDir, function(err, files) {
		err && throw err;

		for (var i = 0; i < files.length; files++) {
			!files[i].match(/\.json$/) && continue;

			var fileName = userDir + '/' + files[i];
			fs.readFile(fileName, function(err, document) {
				err && throw err;

				var user = JSON.parse(document);

				var userId = files[i].substring(0, files[i].lastIndexOf('.json');
				inMemoryStore.storeAccount({
					username: userId,
					password: user.password || defaultPwd,
					roles: user.clearance
				});
			});
		}
	});

	// Set up all the access restrictions
	var access = [
		{
			url: '/admin',
			rules: '[role=admin]'
		}
	];

	var docDir = __dirname + '/data/documents';
	fs.readdir(docDir, function(err, files) {
		err && throw err;

		for (var i = 0; i < files.length; i++) {
			!files[i].match(/\.json$/) && continue;
			
			var fileName = docDir + '/' + files[i];
			fs.readFile(fileName, function(err, document) {
				err && throw err;

				var doc = JSON.parse(document);
				var permissions = [];

				for (var j = 0; j < doc.clearance.length; j++) {
					var clearance = doc.clearance[j];
					var permission = '[permission=' + clearance ']';
					permissions.push('permission');
				}

				var docId = files[i].substring(0, files[i].lastIndexOf('.json'));
				access.push({
					url: '/document/' + docId,
					authentication: 'FORM',
					rules: '[role=admin] || ' + permissions.join(' && ')
				});
			});
		}
	});

	express.use(security({
		debug: false,
		realmName: 'Express-security',
		store: inMemoryStore,
		rememberMe: true,
		secure: false, // whether to use secured cookies or not
		credentialsMatcher: 'sha256',
		loginUrl: '/login',
		logoutUrl: '/logout',
		usernameParam: 'username',
		passwordParam: 'password',
		acl: access
	}));

};
