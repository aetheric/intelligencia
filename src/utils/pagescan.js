module.exports = function(data) {
	var fs = require('fs');
	var _ = require('underscore');

	function process(dirname, path) {
		var files = fs.readdirSync(dirname);

		_.each(files, function(file) {
			var fileName = dirname + '/' + file;
			var stats = fs.statSync(fileName);

			if (stats.isDirectory()) {
				process(fileName, path + file + '/');
				return;
			}

			if (!stats.isFile() || !file.match(/\.j(?:s|ade)$/)) {
				return;
			}

			var pagePath = path + file.stripSuffix('.j', '_');
			var pageName = pagePath.replace(/\\|\//g, '_').remove(/^_/g);
			var page = data.pages[pageName];

			if (!page) {
				page = data.pages[pageName] = {
					path: pagePath
				};
			}

			if (file.match(/\.js$/)) {
				page.script = fileName;
			} else {
				page.template = path.substring(1) + file.stripSuffix('.jade');
			}

		});
	}

	var pagesDir = data.fnDir('/pages');
	process(pagesDir, '/');

};