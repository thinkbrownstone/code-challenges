var gulp = require('gulp'),
	watch = require('gulp-watch'),
	autoprefixer =  require('gulp-autoprefixer')
	sass = require('gulp-sass');

var config = {
	sassSource : "source/sass",
	jsSource: "source/js",
	sassOutput : "destination/css",
	jsOutput : "destination/js"
}


gulp.task('default', function() {

});

gulp.task('sass', function () {
		
  return gulp.src(config.sassSource + '/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
			browsers: ['last 2 versions', 'ie 8-11'],
			cascade: false
		}))
    .pipe(gulp.dest(config.sassOutput));
});
 
gulp.task('sass:watch', function () {
  gulp.watch(config.sassSource + '/**/*.scss', ['sass']);
});