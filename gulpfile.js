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

gulp.task('uglify-js', function() {
  gulp.src(['dist/app.js'])
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});

gulp.task('minify-css', function() {
  gulp.src(['dist/style.css'])
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/'));
});

gulp.task('pack-html', function() {
  gulp.src(['dist/index.html'])
    .pipe(minifyHtml())
    .pipe(gulp.dest('dist/'));
});

gulp.task('dist', function(cb) {
  runSequence('default', ['uglify-js', 'minify-css', 'pack-html'], cb);
});

gulp.task('watch', ['default'], function() {
  gulp.watch('client/**/*', ['default']);
});
