module.exports = function() {
	var _ = require('underscore');
	var mail = require('nodemailer');
	var asciidoc = require('asciidoctorjs-npm-wrapper').Asciidoctor;

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

		init: function(config) {
			return new Promise(function(resolve, reject) {
				if (!config) return reject('Config not provided');

				transport = mail.createTransport('gmail', {
					debug: data.env.current === 'development',
					auth: {
						user: data.env.mail.user,
						pass: data.env.mail.pass
					}
				});

				resolve();
			});
		},

		send: function(options) {
			return new Promise(function(resolve, reject) {
				data.getMailTemplateByName(options.template).then(function(template) {
					if (!template) return reject(new Error('Mail template not found'));

					var mailOptions = options;
					try {
						_.defaults(mailOptions, {
							from: 'Intelligencia <intelligencia@aetheric.co.nz>',
//							html: asciidoc.$render(template.content, options.context),
							text: renderPlain(template.content, options.context)
						});
					} catch (error) {
						return callback(error);
					}

					transport.sendMail(mailOptions, callback);
				});
			});
		}

	};

}();
