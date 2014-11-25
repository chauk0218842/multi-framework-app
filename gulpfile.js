var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var beautify = require('gulp-beautify');
var connect = require('gulp-connect');
var colors = require('colors');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');


/**
 * JS Task
 */
gulp.task('js', function () {

  /**
   * Generate library file
   */
  gulp.src(['./js/ifhc/src/api-template-header.js', './js/ifhc/src/core/*/*.js', './js/ifhc/src/api/*.js', './js/ifhc/src/api-template-footer.js'])
    .pipe(concat('ifhc.js'))
    .pipe(beautify({indentSize: 2}))
    .pipe(gulp.dest('./js/ifhc/dist'));

  /**
   * Minify library file
   */
  gulp.src('./js/ifhc/dist/ifhc.js')
    .pipe(uglify())
    .pipe(concat('ifhc.min.js'))
    .pipe(gulp.dest('./js/ifhc/dist'))
    .pipe(connect.reload());

});


/**
 * SASS Task (compile and minify SASS)
 */
gulp.task('sass', function() {
  gulp.src('./styles/app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./styles/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./styles/'))
    .pipe(connect.reload());
});


/**
 * Dev Task
 * Starts a server and sets up live re-load
 */
gulp.task('dev', ['sass'], function() {
  // Start a server
  connect.server({
    root: '',
    port: 3000,
    livereload: true
  });
  console.log('[CONNECT] Listening on port 3000'.yellow.inverse);

  // Watch HTML files for changes
  console.log('[CONNECT] Watching files for live-reload'.blue);
  watch({ glob: [
    './index.html',
    './js/**/*.*',
    './widgit/**/*.*'
  ]})
    .pipe(connect.reload());

  // Watch HTML files for changes
  console.log('[CONNECT] Watching SASS files'.blue);
  gulp.watch('./styles/*.scss', ['sass']);

  // Watch lib files to build distb
  console.log('[CONNECT] Watching ifhc files'.blue);
  gulp.watch('./js/ifhc/src/**/**.*', ['js']);
});

gulp.task('default', [], function() {
  console.log('**********************************************'.yellow);
  console.log('  gulp dev'.red,'for a connect server,'.yellow);
  console.log('  live reload and auto compile sass'.yellow);
  console.log('  gulp js'.red,'generate a library file,'.yellow);
  console.log('**********************************************'.yellow);
  return true;
});
