module.exports = function(config) {
	config.set({
		basePath: '',
		reporters: ['progress'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: false,
		browsers: ['Chrome'],
		singleRun: true,

		frameworks: [
			'jasmine',
			'requirejs'
		],

		// list of files / patterns to load in the browser
		files: [
			'test-main.js',
			{ pattern: '*.js', included: false },
			{ pattern: 'pages/*.js', included: false },
			{ pattern: 'test/**/*.js', included: false }
		],

		// list of files to exclude
		exclude: [
		],

		// preprocess matching files before serving them to the browser
		// available: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
		}

	});
};
