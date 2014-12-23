'use strict';

var gulp = require('gulp');
var bower = require('main-bower-files');
var browserify = require('browserify');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var rev = require('gulp-rev');
var rimraf = require('rimraf');

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

gulp.task('html', ['clean'], function() {
  gulp.src(['client/index.html'])
    .pipe(gulp.dest('dist/'));
});

gulp.task('prepare', ['browserify', 'styles', 'html'], function() {
});

gulp.task('watch', ['prepare'], function() {
  gulp.watch('client/**/*', ['prepare']);
});
