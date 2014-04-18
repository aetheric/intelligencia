module.exports = function(data) {
	var fs = require('fs');
	var _ = require('underscore');

	function stripSuffix(string, suffix) {
		return string.substring(0, string.lastIndexOf(suffix));
	}

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

			var pageName = stripSuffix(file, '.j');
			if (!data.pages[pageName]) {
				data.pages[pageName] = {
					path: path
				};
			}

			if (file.match(/\.js$/)) {
				data.pages[pageName].script = fileName;
			} else {
				data.pages[pageName].template = path.substring(1) + pageName;
			}

		});
	}

	var pagesDir = data.fnDir('/pages');
	process(pagesDir, '/');

};