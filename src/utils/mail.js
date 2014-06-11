module.exports = function(data) {
	var _ = require('underscore');
	var mail = require('nodemailer');
	var asciidoc = require('asciidoctorjs-npm-wrapper').Asciidoctor;

	var transport = mail.createTransport('gmail', {
		debug: data.env.current === 'development',
		auth: {
			user: data.env.mail.user,
			pass: data.env.mail.pass
		}
	});

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

	data.fnMail = function(options, callback) {
		data.fnMongo(function(err, db) {
			if (err) return callback(err);

			db.collection('mail').find({ name: options.template }).nextObject(function(err, template) {
				if (err) return callback(err);

				if (!template) {
					return callback(new Error('Mail template not found'));
				}

				var mailOptions = options;
				try {
					_.defaults(mailOptions, {
						from: 'Intelligencia <intelligencia@aetheric.co.nz>',
//						html: asciidoc.$render(template.content, options.context),
						text: renderPlain(template.content, options.context)
					});
				} catch (error) {
					return callback(error);
				}

				transport.sendMail(mailOptions, callback);
			});
		});
	};

};