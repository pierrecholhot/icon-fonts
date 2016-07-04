var gulp = require('gulp');

var git = require('gulp-git');
var util = require('gulp-util');
var bump = require('gulp-bump');
var rename = require('gulp-rename');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');

var fs = require('fs');
var as = require('async');
var ms = require('minimist');
var rs = require('run-sequence');

var config = {
  fontName: 'brand-icons',
  fontFormats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
  fontPathFromStyles: '../fonts/',
  success: 'Release finished successfully',
  bump: {
    files: ['./bower.json', './package.json'],
    allowed: ['patch', 'minor', 'major']
  },
  git: {
    upstream: 'origin',
    branch: 'master'
  },
  src: {
    svg: './src/svg/*.svg',
    templates: './src/templates/*.*'
  },
  dist: {
    root: './dist',
    fonts: './dist/fonts',
    styles: './dist/styles'
  }
};

function cleanDist(callback) {
  return require('del')(config.dist.root, callback);
}

function makeFonts(callback) {

  var iconStream, handleGlyphs, handleFonts;

  iconStream = gulp.src(config.src.svg).pipe(iconfont({
    fontName: config.fontName,
    formats: config.fontFormats
  }));

  handleGlyphs = function (done) {
    iconStream.on('glyphs', function (glyphs, options) {
      gulp.src(config.src.templates)
        .pipe(consolidate('lodash', {
          glyphs: glyphs,
          fontName: config.fontName,
          fontPath: config.fontPathFromStyles,
          cssClass: config.fontName
        }))
        .pipe(rename(function (path) {
          if (path.basename !== 'font-face') {
            path.basename = config.fontName;
          }
        }))
        .pipe(gulp.dest(config.dist.styles))
        .on('finish', done);
    });
  };

  handleFonts = function (done) {
    iconStream.pipe(gulp.dest(config.dist.fonts)).on('finish', done);
  };

  as.parallel([handleGlyphs, handleFonts], callback);
}

function bumpVersion() {
  var opts = {
    type: config.bump.allowed[0]
  };
  var args = ms(process.argv.slice(2));
  for (var i = 0; i < config.bump.allowed.length; i++) {
    if (args[config.bump.allowed[i]]) {
      opts.type = config.bump.allowed[i]
    };
  }
  return gulp.src(config.bump.files)
    .pipe(bump(opts).on('error', util.log))
    .pipe(gulp.dest('./'));
}

function commitChanges() {
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('[Release] Add icons '));
}

function pushChanges(callback) {
  git.push(config.git.upstream, config.git.branch, callback);
}

function createNewTag(callback) {
  var version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
  var commitMessage = 'Created Tag for version: ' + version;
  git.tag(version, commitMessage, function (error) {
    if (error) {
      return callback(error);
    }
    git.push(config.git.upstream, config.git.branch, {
      args: '--tags'
    }, callback);
  });
}

function readMe() {
  console.log(fs.readFileSync('readme.md', 'utf8'));
}

function addIcons(callback) {
  rs(
    'ಠ_ಠ___clean-dist',
    'ಠ_ಠ___make-font-files',
    'ಠ_ಠ___bump-version',
    'ಠ_ಠ___commit-changes',
    'ಠ_ಠ___push-changes',
    'ಠ_ಠ___create-new-tag',
    function (error) {
      console.log(error ? error.message : config.success);
      callback(error);
    }
  );
}

gulp.task('ಠ_ಠ___clean-dist', cleanDist);
gulp.task('ಠ_ಠ___make-font-files', makeFonts);
gulp.task('ಠ_ಠ___bump-version', bumpVersion);
gulp.task('ಠ_ಠ___commit-changes', commitChanges);
gulp.task('ಠ_ಠ___push-changes', pushChanges);
gulp.task('ಠ_ಠ___create-new-tag', createNewTag);

gulp.task('default', readMe);
gulp.task('icons', addIcons);
