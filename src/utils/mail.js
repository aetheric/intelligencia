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

	function renderPlain(template, context) {
		return _.inject(context, function(text, value, key) {
			var pattern = new RegExp('{' + key + '}', 'g');
			return text.replace(pattern, value);
		}, template);
	}

	data.fnMail = function(options, callback) {
		data.fnMongo(function(err, db) {
			if (err) throw err;

			db.collection('mail').find({ name: options.template }).nextObject(function(err, template) {
				if (err) {
					throw err;
				} else if (!template) {
					throw 'Mail template not found!';
				}

				transport.sendMail(_.defaults(options, {
					from: 'Intelligencia <intelligencia@aetheric.co.nz>',
					html: asciidoc.$render(template.content, options.context),
					text: renderPlain(template.content, options.context)
				}), callback);
			});
		});
	};

};