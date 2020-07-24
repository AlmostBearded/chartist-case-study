// # Setup

const gulp = require('gulp');

// ## Sass

const gulpSass = require('gulp-sass');
const nodeSass = require('node-sass');
gulpSass.compiler = nodeSass;

// ## BrowserSync

const browserSync = require('browser-sync').create();

// ## Utilities

const del = require('del');

// # Private tasks

// ## Compile sass files

function compileSass() {
  return gulp
    .src('./src/sass/main.scss')
    .pipe(gulpSass().on('error', gulpSass.logError))
    .pipe(gulp.dest('./dist/css'));
}

// ## Copy Chartist files

function copyChartistFiles() {
  return gulp
    .src([
      './node_modules/chartist/dist/chartist.js',
      './node_modules/chartist/dist/chartist.min.js',
      './node_modules/chartist/dist/chartist.min.js.map',
    ])
    .pipe(gulp.dest('./dist/vendor'));
}

// ## Copy HTML files

function copyHTMLFiles() {
  return gulp.src('./src/**/*.html').pipe(gulp.dest('./dist'));
}

// ## Reload browser

function reloadBrowser(cb) {
  browserSync.reload();
  cb();
}

// # Public tasks

exports.clean = function clean() {
  return del('dist/**', { force: true });
};

exports.build = gulp.series([
  exports.clean,
  gulp.parallel([compileSass, copyChartistFiles, copyHTMLFiles]),
]);

exports.serve = function serve() {
  browserSync.init({
    server: './dist',
  });

  gulp.watch('./src/**/*', { ignoreInitial: false }, gulp.series(exports.build, reloadBrowser));
};

exports.default = exports.serve;
