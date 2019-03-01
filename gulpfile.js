// install: npm install
// run: gulp

var gulp = require('gulp');
var watch = require('gulp-watch');
var exec = require('child_process').exec;

gulp.task('default', function () {
    // Generate current version
    exec('composer build', function (err, stdout, stderr) {
        console.log(stdout);
        console.error(stderr);
    });

    // Run local server, open localhost:8000 in your browser
    exec('php -S localhost:8000 -t dist');
    console.log('Local PHP server started at "http://localhost:8000", open browser to see it.');

    // For the second arg see: https://github.com/floatdrop/gulp-watch/issues/242#issuecomment-230209702
    return watch(['site/**/*', '!**/*___jb_tmp___'], { ignoreInitial: false })
        .on('change', function() {
            exec('composer build', function (err, stdout, stderr) {
                console.log(stdout);
                console.error(stderr);
            });
        });
});
