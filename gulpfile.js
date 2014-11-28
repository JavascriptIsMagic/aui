'use strict';
/*
npm install -save-dev gulp gulp-util gulp-rename del run-sequence vinyl-source-stream gulp-livereload browserify watchify stylify reactify es6ify uglifyify insert-css send jquery semantic-ui react react-bacon baconjs
*/

var array = Function.prototype.call.bind(Array.prototype.slice);

// Gulp:
var
	gulp = require('gulp'),
	gulpUtil = require('gulp-util'),
	log = gulpUtil.log.bind(gulpUtil),
	del = require('del'),
	rename = require('gulp-rename'),
	sequence = require('run-sequence'),
	source = require('vinyl-source-stream');

// Static Server:
var
	http = require('http'),
	send = require('send'),
	url = require('url'),
	livereload = require('gulp-livereload');

// Browserify:
var
	browserify = require('browserify'),
	watchify = require('watchify'),
	stylify = require('stylify'),
	reactify = require('reactify'),
	uglifyify = require('uglifyify'),
	es6ify = require('es6ify');
es6ify.traceurOverrides = { experimental: true };

// Build Options:
var
	jsx = { extension: 'jsx', ignore: ['**/*.min.js', '**/*.styl'] },
	style = { extension: 'styl', ignore: ['**/*.min.js', '**/*.jsx'] },
	
	transforms = [
		[ stylify, style],
		[ reactify, jsx],
		[ es6ify.configure(/\.jsx$/), jsx],
		// Uglify even when debugging.
		// Uglify fixes source maps?
		[ uglifyify, jsx]
	],
	
	options = {
		debug: {
			debug: true,
			entry: './src/Master.jsx',
			path: __dirname + '/build/debug/pages',
			output: 'bundle.min.js',
			
			adds: [es6ify.runtime],
			transforms: transforms,
			
			port: {
				server: 8888,
				livereload: 35731,
			},
		},
		release: {
			entry: './src/Master.jsx',
			path: __dirname + '/build/release/pages',
			output: 'bundle.min.js',
			
			adds: [es6ify.runtime],
			transforms: transforms,
			
			fullPaths: false,
		}
	};

// Copy Files:
var
	filePaths = [
		__dirname + '/src/**/*.html',
		__dirname + '/src/**/*.min.css',
		__dirname + '/src/**/*.min.js',
		__dirname + '/**/logos/*.png',
		__dirname + '/node_modules/semantic-ui/dist/semantic.min.css',
	];

// Adds watchify.args to all options if not present:
Object.keys(options).forEach(function (type) {
	options[type].type = type;
	Object.keys(watchify.args).forEach(function (key) {
		options[type][key] = (
			options[type][key] === void(0) ?
				watchify.args[key] :
				options[type][key]);
	});
});

function copyFiles(options) {
	return gulp.src(filePaths).pipe(gulp.dest(options.path));
}

function server(options, callback) {
	livereload.listen(options.port.livereload);
	gulp.watch(filePaths,
		['aui:build:' + options.type + ':copyfiles']);
	gulp.watch([options.path + '/**/*'], function (event) {
		livereload.changed(event.path);
	});
	http.createServer(function(request, response) {
		log(request.url);
		send(request,
			url.parse(request.url).pathname, {
				root: options.path,
			}).pipe(response);
	}).listen(options.port.server);
}

function build(options, watching) {
	var bundler = (
		watching ?
			watchify(browserify(options)) :
			browserify(options));
	
	// Add all options.adds:
	if (options.adds) {
		options.adds.forEach(bundler.add.bind(bundler));
	}
	
	// Apply all options.transforms
	if (options.transforms) {
		options.transforms.forEach(function (transform) {
			bundler.transform.apply(bundler, transform);
		});
	}
	
	bundler.require(require.resolve(options.entry), { entry: true });
	
	function rebuild(bundle) {
		log('Browserifying', '\n\t\t' +
			array(bundle || ['...']).
				map(function (filename) {
					return (filename.
						replace(/^.+[\/\\]+node_modules[\/\\]+/i, '').
						replace(/[\/\\]+/g, '/')); }).
				join('\n\t\t'));
		return (bundler.bundle().
			on('error', log.bind('Browserify Error')).
			pipe(source(options.entry)).
			pipe(rename(options.output)).
			pipe(gulp.dest(options.path)));
	}
	bundler.on('update', rebuild);
	bundler.on('log', log);
	return rebuild();
}

// Gulp Tasks:
gulp.task('aui', [
	'aui:watch:debug']);

gulp.task('aui:clean', [
	'aui:build:debug:clean',
	'aui:build:release:clean']);

gulp.task('aui:install', function (callback) {
	sequence(
		'aui:clean',
		'aui:build:release',
		callback);
});

// UI Build Release:
gulp.task('aui:build:release', function (callback) {
	sequence(
		'aui:build:release:clean', [
			'aui:build:release:copyfiles',
			'aui:build:release:browserify'],
		callback);
});

gulp.task('aui:build:release:clean',
	del.bind(null, [options.release.path]));

gulp.task('aui:build:release:copyfiles',
	copyFiles.bind(null, options.release));

gulp.task('aui:build:release:browserify',
	build.bind(null, options.release, false));

// UI Build Debug:
gulp.task('aui:build:debug', function (callback) {
	sequence(
		'aui:build:debug:clean', [
			'aui:build:debug:copyfiles',
			'aui:build:debug:browserify'],
		callback);
});

gulp.task('aui:build:debug:clean',
	del.bind(null, [options.debug.path]));

gulp.task('aui:build:debug:copyfiles',
	copyFiles.bind(null, options.debug));

gulp.task('aui:build:debug:browserify',
		build.bind(null, options.debug, false));

// UI Watch Debug:
gulp.task('aui:watch:debug', function (callback) {
	sequence(
		'aui:build:debug:clean', [
			'aui:build:debug:copyfiles',
			'aui:watch:debug:browserify',
			'aui:watch:debug:server'],
		callback);
});

gulp.task('aui:watch:debug:browserify',
	build.bind(null, options.debug, true));

gulp.task('aui:watch:debug:server',
	server.bind(null, options.debug));
