module.exports = function(express, data) {
	var _ = require('underscore');

	var security = require('security-middleware');
	var utils = require('security-middleware/lib/security.js');

	var credentialsMatcher = utils.sha256CredentialsMatcher;
	var defaultPwd = credentialsMatcher.encrypt('changeme');

	data.fnEncryptPass = function(password) {
		return credentialsMatcher.encrypt(password);
	};

	var config = {
		debug: data.env.dev || false,
		realmName: 'intelligencia',
		rememberMe: false,
		secure: false, // whether to use secured cookies or not
		credentialsMatcher: 'sha256',
		loginUrl: '/auth/login',
		logoutUrl: '/auth/logout',
		usernameParam: 'username',
		passwordParam: 'password',
		acl: [
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
		]
	};

	var Store = function() {};

	Store.prototype.lookup = function(username, callback) {
		data.fnMongo(function(db) {
			db.collection('users').find({
				username: username
			}).nextObject(function(err, user) {
				if (err) callback(err);
				if (!user) {
					callback();
					return;
				}

				if (!user.password) {
					user.password = defaultPwd;
				}

				callback(err, user);
			});
		});
	};

	Store.prototype.loadUserRoles = function(username, callback) {
		data.fnMongo(function(db) {
			db.collection('users').find({
				username: username
			}).nextObject(function(err, user) {
				if (err) callback(err);
				if (!user) callback();
				callback(user.roles);
			});
		});
	};

	Store.prototype.loadUserPrivileges = function(username, callback) {
		data.fnMongo(function(db) {
			db.collection('users').find({
				username: username
			}).nextObject(function(err, user) {
				if (err) callback(err);
				if (!user) callback();
				callback(user.privileges);
			});
		});
	};

	Store.prototype.loadRolePrivileges = function(roleName, callback) {
		data.fnMongo(function(db) {
			db.collection('codes').find({
				title: roleName
			}).nextObject(function(err, code) {
				if (err) callback(err);
				if (!code) callback();
				callback(code.implies);
			});
		});
	};

	config.store = new Store();
	express.use(security(config));

	// Load up all the doc permissions
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

			config.acl.push({
				url: '/app/doc/view/' + doc._id,
				authentication: 'FORM',
				rules: '[role=admin] || ' + permissions.join(' && ')
			});
		});
	});

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
