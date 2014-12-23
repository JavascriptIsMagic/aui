var
	fs = require('fs'),
	gulp = require('gulp');

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
