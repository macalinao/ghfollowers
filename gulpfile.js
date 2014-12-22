'use strict';

var gulp = require('gulp');
var bower = require('main-bower-files');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var rev = require('gulp-rev');
var rimraf = require('rimraf');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');

gulp.task('clean', function(cb) {
  rimraf('dist/', function() {
    rimraf('client/assets/', cb);
  });
});

gulp.task('bower:css', ['clean'], function() {
  return gulp.src(bower().filter(function(file) {
      return file.indexOf('.css') === file.length - 4;
    }))
    .pipe(gulp.dest('client/assets/css/'));
});

gulp.task('bower:js', ['clean'], function() {
  return gulp.src(bower().filter(function(file) {
      return file.indexOf('.js') === file.length - 3;
    }))
    .pipe(gulp.dest('client/assets/js/'));
});

gulp.task('bower', ['bower:css', 'bower:js'], function() {});

gulp.task('inject', ['bower'], function() {
  var cssSources = gulp.src(['client/assets/css/*', 'client/css/*.css']);
  var jsSources = gulp.src(['client/assets/js/*', 'client/scripts/*.js']);

  gulp.src(['client/index.html'])
    .pipe(inject(cssSources, {
      relative: true
    }))
    .pipe(inject(jsSources, {
      relative: true
    }))
    .pipe(gulp.dest('client/'));
});

gulp.task('watch', function() {
  gulp.watch('client/**/*', ['inject']);
});

gulp.task('dist:css', ['bower:css'], function() {
  return gulp.src(['client/assets/css/*.css'])
    .pipe(concat('vendor.css'))
    .pipe(minifyCSS())
    .pipe(rev())
    .pipe(gulp.dest('dist/assets/'));
});

gulp.task('dist:js', ['bower:js'], function() {
  return gulp.src(['client/assets/js/*.js'])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('dist/assets/'));
});

gulp.task('dist', ['dist:css', 'dist:js'], function() {

});
