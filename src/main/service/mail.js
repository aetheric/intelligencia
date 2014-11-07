module.exports = function() {
	var _ = require('underscore');
	var mail = require('nodemailer');
	var asciidoc = require('asciidoctorjs-npm-wrapper').Asciidoctor;
	//TODO: Get Asciidoctor rendering of email templates working.
	var Promise = require('promise');

	var transport;

	// Will match the following text:
	// link:http://keepass.info/[Keepass] http://keepass.info[Keepass]
	var regexAdocLink = /(?:link:)?(\S+?)\[(.+?)\]/g;

	function renderPlain(template, context) {
		var result = _.inject(context, function(text, value, key) {
			var pattern = new RegExp('\\{' + key + '\\}', 'g');
			return text.replace(pattern, value);
		}, template);

		// Manual asciidoc intervention.
		result = result.replace(regexAdocLink, '$2 ($1)');

		return result;
	}

	return {

		/**
		 * Initialises the mail transport engine. Requires a username, password, and optional debug mode flag.
		 * @param {Object} config A map containing 'username' and 'password' information for the gmail sender account.
		 * @returns {Promise} Will resolve with no arguments if successful, otherwise will reject with error.
		 */
		init: function(config) {
			return new Promise(function(resolve, reject) {
				if (!config) return reject(new Error('Config not provided'));

				try {
					transport = mail.createTransport('gmail', {
						debug: config.debug || false,
						auth: {
							user: config.username,
							pass: config.password
						}
					});
				} catch (error) {
					return reject(error);
				}

				return resolve();
			});
		},

		/**
		 * Sends an email based on a stored template to an address with a subject. Supports plain text and asciidoc.
		 * @param {Object} options a map containing 'to', 'subject', 'template' and rendering 'context' information.
		 * @returns {Promise} Will resolve with no arguments if successful, otherwise will reject with error.
		 */
		send: function(options) {
			return new Promise(function(resolve, reject) {
				data.getMailTemplateByName(options.template).then(function(template) {
					if (!template) return reject(new Error('Mail template not found'));

					try {
						transport.sendMail(_.defaults(options, {
							from: 'Intelligencia <intelligencia@aetheric.co.nz>',
//							html: asciidoc.$render(template.content, options.context),
							text: renderPlain(template.content, options.context)
						}), function(error, info) {
							error
								? reject(error)
								: resolve(info);
						});
					} catch (error) {
						return reject(error);
					}
				});
			});
		}

	};

}();
