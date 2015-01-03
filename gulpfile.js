'use strict';

var gulp = require('gulp');
var bower = require('main-bower-files');
var browserify = require('browserify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var reactify = require('reactify');
var rev = require('gulp-rev');
var rimraf = require('rimraf');
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var revReplace = require('gulp-rev-replace');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');

gulp.task('clean', function(cb) {
  rimraf('dist/', cb);
});

gulp.task('browserify', ['clean'], function() {
  var b = browserify();
  b.transform(reactify); // use the reactify transform
  b.add('./client/scripts/app.jsx');
  return b.bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('styles', ['clean'], function() {
  gulp.src(['bower_components/bootstrap/dist/css/bootstrap.css', 'client/css/*'])
    .pipe(concat('style.css'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy', ['clean'], function() {
  gulp.src(['public/*'])
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['browserify', 'styles', 'copy'], function() {});

gulp.task('dist', ['default'], function(cb) {
  var jsFilter = filter("**/*.js");
  var cssFilter = filter("**/*.css");

  var assets = useref.assets();

  return gulp.src('dist/index.html')
    .pipe(assets)
    .pipe(jsFilter)
    .pipe(uglify()) // Minify any javascript sources
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(minifyCss()) // Minify any CSS sources
    .pipe(cssFilter.restore())
    .pipe(rev()) // Rename the concatenated files
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(revReplace()) // Substitute in new filenames
    .pipe(gulp.dest('dist/'));

});

gulp.task('watch', ['default'], function() {
  gulp.watch('client/**/*', ['default']);
});
