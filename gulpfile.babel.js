'use strict';

import gulp from 'gulp';

import babelify from 'babelify';
import bower from 'main-bower-files';
import browserify from 'browserify';
import concat from 'gulp-concat';
import minifyCss from 'gulp-minify-css';
import minifyHtml from 'gulp-minify-html';
import rev from 'gulp-rev';
import rimraf from 'rimraf';
import useref from 'gulp-useref';
import filter from 'gulp-filter';
import revReplace from 'gulp-rev-replace';
import runSequence from 'run-sequence';
import source from 'vinyl-source-stream';
import uglify from 'gulp-uglify';

gulp.task('clean', (cb) => {
  rimraf('dist/', cb);
});

gulp.task('browserify', ['clean'], () => {
  const extensions = ['.js', '.jsx'];
  return browserify({ extensions })
    .transform(babelify.configure({
      extensions
    }))
    .require('./client/scripts/app.jsx', { entry: true })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('styles', ['clean'], () => {
  gulp.src(['bower_components/bootstrap/dist/css/bootstrap.css', 'client/css/*'])
    .pipe(concat('style.css'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy', ['clean'], () => {
  gulp.src(['public/**/*'])
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['browserify', 'styles', 'copy'], () => {});

gulp.task('dist', ['default'], (cb) => {
  var jsFilter = filter("**/*.js");
  var cssFilter = filter("**/*.css");

  var assets = useref.assets();

  return gulp.src('dist/index.html')
    .pipe(assets)
    .pipe(jsFilter)
    .pipe(uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(minifyCss())
    .pipe(cssFilter.restore())
    .pipe(rev())
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(revReplace({
      replaceInExtensions: ['.html']
    }))
    .pipe(gulp.dest('dist/'));

});

gulp.task('watch', ['default'], () => {
  gulp.watch('client/**/*', ['default']);
});
