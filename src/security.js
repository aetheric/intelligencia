module.exports = function(express, data) {
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

	function scrape(path, callback) {
		var targetDir = data.fnDir('/../etc' + path);
		console.log('Scraping "' + targetDir + '" for data.');
		fs.readdir(targetDir, function(err, files) {
			if (err) throw err;

			_.each(files, function(file) {
				if (!file.match(/\.json$/)) return;

				fs.readFile(targetDir + '/' + file, function(err, document) {
					if (err) throw err;

					var data = JSON.parse(document);
					var id = file.substring(0, file.lastIndexOf('.json'));
					callback(data, id);
				});
			});
		});
	}

	// Set up all the roles.
	scrape('/codes', function(code, codeId) {
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
	scrape('/users', function(user, userId) {
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
			url: '/admin/*',
			authentication : 'FORM',
			rules: '[role=admin]'
		},
		{
			url: '/app/*',
			authentication: 'FORM',
			rules: '[role=admin] || [role=user]'
		}
	];

	scrape('/documents', function(doc, docId) {
		var permissions = [];

		_.each(doc.clearance, function(clearance) {
			console.log('Adding permission "' + clearance + '" to "/app/document/view/' + docId + '"');
			var permission = '[permission=' + clearance + ']';
			permissions.push('permission');
		});

		access.push({
			url: '/app/document/view/' + docId,
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
		loginUrl: '/auth/login',
		logoutUrl: '/auth/logout',
		usernameParam: 'username',
		passwordParam: 'password',
		acl: access
	}));

	// Add the current user to the rendering context.
	express.use(function(req, res, next) {
		var subject = req.subject;
		var auth = res.locals.auth = {
			isValid: subject.isAuthenticated(),
			user: subject.getPrincipal()
		};

		if (auth.isValid) {

			subject.hasRole('admin', function(isAdmin) {
				auth.isAdmin = isAdmin;
			});

		}

		next();
	});

};
