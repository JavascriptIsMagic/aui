var
	fs = require('fs'),
	gulp = require('gulp'),
	sequence = require('run-sequence'),
	
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	
	git = require('gulp-git'),
	bump = require('gulp-bump'),
	filter = require('gulp-filter'),
	tag = require('gulp-tag-version');

gulp.task('aui:build', function() {
  gulp.src(__dirname + '/src/aui.js')
    .pipe(gulp.dest(__dirname + '/dist'))
		.pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.init())
			.pipe(uglify())
		.pipe(sourcemaps.write(__dirname + '/dist/', { addComment: false }))
    .pipe(gulp.dest(__dirname + '/dist'))
});

function listSemanticModules() {
	var modules = [];
	('' + fs.readFileSync(require.resolve('semantic-ui/dist/semantic')))
		.replace(/\$\.fn\.(\w+)\s=/g, function (match, module) {
			modules.push(module);
		});
	return modules;
}

gulp.task('aui:semantic:modules', function () {
	fs.writeFile(
		__dirname + '/dist/semantic.modules.json',
		JSON.stringify(listSemanticModules(), null, '\t'));
});

function version(importance) {
	return gulp.src([
			__dirname + '/package.json',
			__dirname + '/bower.json'])
		.pipe(bump({type: importance}))
		.pipe(gulp.dest(__dirname + '/'))
		.pipe(git.commit('releasing ' + importance + ' version.'))
		.pipe(filter('package.json'))
		.pipe(tag());
}

gulp.task('aui:patch', version.bind(null, 'patch'));
gulp.task('aui:feature', version.bind(null, 'minor'));
gulp.task('aui:release', version.bind(null, 'major'));
