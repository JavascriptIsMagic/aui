var
	fs = require('fs'),
	gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps');

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