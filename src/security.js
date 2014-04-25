module.exports = function(express, data) {
	var _ = require('underscore');

	var security = require('security-middleware');
	var utils = require('security-middleware/lib/security.js');

	var inMemoryStore = utils.inMemoryStore;
	var credentialsMatcher = utils.sha256CredentialsMatcher;

	var defaultPwd = credentialsMatcher.encrypt('changeme');
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

	data.fnMongo(function(db) {
		db.collection('users').find().each(function(err, doc) {
			if (err) throw err;
			if (!doc) return;

			if (!doc.password) {
				doc.password = defaultPwd;
			}

			inMemoryStore.storeAccount(doc);
		});
	});

	data.fnMongo(function(db) {
		db.collection('codes').find().each(function(err, doc) {
			if (err) throw err;
			if (!doc) return;

			_.inject(levels, function(privileges, level) {
				if (levels[doc.clearance] > levels[level])
					return privileges;

				var roleName = doc.title + ':' + level;
				privileges.push('[privilege=' + roleName + ']');
				console.log('Adding role "' + roleName + '" with privileges "' + privileges.join(', ') + '"');

				inMemoryStore.storeRole({
					name: roleName,
					privileges: privileges
				});

				return privileges;
			}, []);
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

	data.fnMongo(function(db) {
		db.collection('docs').find().each(function(err, doc) {
			if (err) throw err;
			if (!doc) return;

			var permissions = [];

			_.each(doc.clearance, function(clearance) {
				console.log('Adding permission "' + clearance + '" to "/app/document/view/' + doc.title + '"');
				var permission = '[permission=' + clearance + ']';
				permissions.push('permission');
			});

			access.push({
				url: '/app/doc/view/' + doc._id,
				authentication: 'FORM',
				rules: '[role=admin] || ' + permissions.join(' && ')
			});
		});
	});

	express.use(security({
		debug: false,
		realmName: 'Express-security',
		store: inMemoryStore,
		rememberMe: false,
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
