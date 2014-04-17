module.exports = function(express) {
	var fs = require('fs');
	var _ = require('underscore');

	var security = require('security-middleware');
	var utils = require('security-middleware/lib/security.js');

	var inMemoryStore = utils.inMemoryStore;
	var credentialsMatcher = utils.sha256CredentialsMatcher;

	var defaultPwd = credentialsMatcher.encrypt('changeit');
	var levels = _.extend([
		'alpha',
		'beta',
		'gamma',
		'delta',
		'epsilon'
	], {
		alpha: 0,
		beta: 1,
		gamma: 2,
		delta: 3,
		epsilon: 4
	});

	function scrape(dir, callback) {
		fs.readdir(dir, function(err, files) {
			if (err) throw err;

			_.each(files, function(file) {
				if (!file.match(/\.json$/)) return;

				fs.readFile(dir + '/' + file, function(err, document) {
					if (err) throw err;

					var data = JSON.parse(document);
					var id = file.substring(0, file.lastIndexOf('.json'));
					callback(data, id);
				});
			});
		});
	}

	// Set up all the roles.
	scrape(__dirname + '/data/codes', function(code, codeId) {
		_.inject(levels, function(privileges, level) {
			if (levels[code.clearance] > levels[level])
				return privileges;

			var roleName = codeId + ':' + level;
			privileges.push('[privilege=' + roleName + ']');
			console.log('Adding role "' + roleName + '" with privileges "' + privileges.join(', ') + '"');

			inMemoryStore.storeRole({
				name: codeId + ':' + level,
				privileges: privileges
			});

			return privileges;
		}, []);
	});

	// Set up all the users
	scrape(__dirname + '/data/users', function(user, userId) {
		console.log('Loading user "' + userId + '"');
		user.clearance.push('user');
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
			authentication : 'FORM',
			rules: '[role=admin]'
		},
		{
			url: '/document/list',
			authentication : 'FORM',
			rules: '[role=admin] || [role=user]'
		}
	];

	scrape(__dirname + '/data/documents', function(doc, docId) {
		var permissions = [];

		_.each(doc.clearance, function(clearance) {
			console.log('Adding permission "' + clearance + '" to "/document/' + docId + '"');
			var permission = '[permission=' + clearance + ']';
			permissions.push('permission');
		});

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

	// Add the current user to the rendering context.
	express.use(function(req, res, next) {
		res.locals.auth = req.subject;
		next();
	});

};
