var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var beautify = require('gulp-beautify');

/**
 * JS Task
 */
gulp.task('js', function () {

  /**
   * Generate library file
   */
  gulp.src(['./js/ifhc/src/api_template_header.js', './js/ifhc/src/core/*/*.js', './js/ifhc/src/api/*.js', './js/ifhc/src/api_template_footer.js'])
    .pipe(concat('ifhc.js'))
    .pipe(beautify({indentSize: 2}))
    .pipe(gulp.dest('./js/ifhc/dist'));

  /**
   * Minify library file
   */
  gulp.src('./js/ifhc/dist/ifhc.js')
    .pipe(uglify())
    .pipe(concat('ifhc.min.js'))
    .pipe(gulp.dest('./js/ifhc/dist'));

});

gulp.task('default', function () {
  gulp.run('js');
});
