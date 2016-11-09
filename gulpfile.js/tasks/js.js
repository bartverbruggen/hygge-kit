var config = require('../../gulp.config');
if(!config.tasks.js) return;

var gulp = require('gulp');
var browserSync = require('browser-sync');
var handleErrors = require('../lib/handleErrors');
var webpack = require('gulp-webpack');
var webpackMultiConfig = require('../lib/webpack.config');
var path = require('path');

var paths = {
  src: path.join(config.root.src, config.tasks.js.src, '/**/*.{' + config.tasks.js.extensions + '}'),
  dest: path.join(config.root.dest, config.tasks.js.dest)
};

var jsTask = function () {
  var webpackConfig = webpackMultiConfig('production');
  return gulp.src(paths.src)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream());
};

gulp.task('js', jsTask);
module.exports = jsTask;
