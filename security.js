module.exports = function(express) {
	var fs = require('fs');

	var security = require('security-middleware');
	var utils = require('security-middleware/lib/security.js');

	var inMemoryStore = utils.inMemoryStore;
	var credentialsMatcher = utils.sha256CredentialsMatcher;

	var defaultPwd = credentialsMatcher.encrypt('changeit');

	function scrape(dir, callback) {
		fs.readdir(dir, function(err, files) {
			if (err) throw err;

			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				if (!file.match(/\.json$/)) continue;

				fs.readFile(dir + '/' + file, function(err, document) {
					if (err) throw err;

					var data = JSON.parse(document);
					var id = file.substring(0, file.lastIndexOf('.json'));
					callback(data, id);
				});
			}
		});
	}

	// Set up all the roles.
	scrape(__dirname + '/data/codes', function(code) {
		var privileges = [];
		for (var j = 0; j < code.clearance.length; j++) {
			var clearance = code.clearance[j];
			privileges.push(clearance);

			inMemoryStore.storeRole({
				name: clearance,
				privileges: privileges
			});
		}
	});

	// Set up all the users
	scrape(__dirname + '/data/users', function(user, userId) {
		inMemoryStore.storeAccount({
			username: userId,
			password: user.password || defaultPwd,
			roles: user.clearance
		});
	});

	// Set up all the access restrictions
	var access = [
		{
			url: '/admin',
			rules: '[role=admin]'
		}
	];

	scrape(__dirname + '/data/documents', function(doc, docId) {
		var permissions = [];

		for (var j = 0; j < doc.clearance.length; j++) {
			var clearance = doc.clearance[j];
			var permission = '[permission=' + clearance + ']';
			permissions.push('permission');
		}

		access.push({
			url: '/document/' + docId,
			authentication: 'FORM',
			rules: '[role=admin] || ' + permissions.join(' && ')
		});
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
