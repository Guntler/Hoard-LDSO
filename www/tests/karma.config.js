// Karma configuration
// Generated on Sun Dec 21 2014 15:56:27 GMT+0000 (GMT Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['ng-scenario', 'jasmine'],


    // list of files / patterns to load in the browser
    files: [
		//'../angular/angular.min.js',
		'../angular/angular-*.js',
		'angular-mocks.js',
		'../js/*.js',
		'../js/**/*.js',
		'welcome/*.test.js'
    ],


    // list of files to exclude
    exclude: [
		'test-main.js'
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

	
	proxies: {
		'/': 'http://localhost:8081/'
	},

	
	urlRoot: '/_karma_/',
	
	
    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox'],
	
	/*plugins: [
		'karma-ng-scenario',
		'karma-firefox-launcher',
		'karma-ie-launcher'
	],*/


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
