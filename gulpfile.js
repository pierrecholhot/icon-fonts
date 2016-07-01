var gulp = require('gulp');
var git = require('gulp-git');
var util = require('gulp-util');
var bump = require('gulp-bump');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');

var fs = require('fs');
var ms = require('minimist');
var rs = require('run-sequence');

var timestamp = Math.round(Date.now() / 1000);
var availableBumps = ['major', 'minor', 'patch'];

var config = {
  fontName: 'laposte-icons',
  formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
  branch: 'master',
  svg: ['src/svg/*.svg']
};

var iconFontOptions = {
  fontName: config.fontName,
  formats: config.formats,
  prependUnicode: true,
  timestamp: timestamp
};

var iconFontCssBaseOptions = {
  fontPath: './',
  fontName: config.fontName,
  cssClass: config.fontName
};

function makeFont(ext){
  var iconFontCssOptions = Object.assign({}, iconFontCssBaseOptions, { path: ext, targetPath: './laposte-fonts.' + ext });
  return gulp.src(config.svg)
    .pipe(iconfontCss(iconFontCssOptions))
    .pipe(iconfont(iconFontOptions))
    .pipe(gulp.dest('dist/fonts/'));
}

gulp.task('make-font-files-css',  function() { return makeFont('css');  });
gulp.task('make-font-files-less', function() { return makeFont('less'); });
gulp.task('make-font-files-scss', function() { return makeFont('scss'); });

gulp.task('bump-version', function () {
  var opts = {};
  var args = ms(process.argv.slice(2));
  for (var i = 0; i < availableBumps.length; i++) {
    if (args[availableBumps[i]]) { opts.type = availableBumps[i] };
  }
  return gulp.src(['./bower.json', './package.json'])
    .pipe(bump(opts).on('error', util.log))
    .pipe(gulp.dest('./'));
});

gulp.task('commit-changes', function () {
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('[Release] Bumped version number'));
});

gulp.task('push-changes', function (cb) {
  git.push('origin', config.branch, cb);
});

gulp.task('create-new-tag', function (cb) {
  var version = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  var commitMessage = 'Created Tag for version: ' + version;
  git.tag(version, commitMessage, function (error) {
    if (error) { return cb(error); }
    git.push('origin', config.branch, { args: '--tags' }, cb);
  });
});

gulp.task('clean', function (callback) {
  return require('del')('./dist', callback);
});

gulp.task('add', function (callback) {
  rs(
    'clean',
    'make-font-files-scss',
    'make-font-files-less',
    'make-font-files-css',
    // 'bump-version',
    // 'commit-changes',
    // 'push-changes',
    // 'create-new-tag',
    function (error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('RELEASE FINISHED SUCCESSFULLY');
      }
      callback(error);
    });
});
