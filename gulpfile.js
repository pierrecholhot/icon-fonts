var gulp = require('gulp');

var git = require('gulp-git');
var util = require('gulp-util');
var bump = require('gulp-bump');
var rename = require('gulp-rename');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');

var _ = require('lodash');
var fs = require('fs');
var exec = require('child_process').exec;
var async = require('async');
var minimist = require('minimist');
var runSequence = require('run-sequence');
var conventionalChangelog = require('conventional-changelog');

var config = require('./config');

var modifiedIcons = [];

function cleanDist(callback) {
  return require('del')(config.dist.root, callback);
}

function generateFonts(callback) {
  var iconStream, handleGlyphs, handleFonts;

  iconStream = gulp.src(config.src.svg).pipe(iconfont({
    fontName: config.fontName,
    formats: config.fontFormats,
    normalize: true
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
          if (path.basename === 'icons') { path.basename = config.fontName; }
        }))
        .pipe(gulp.dest(config.dist.root))
        .on('finish', done);
    });
  };

  handleFonts = function (done) {
    iconStream.pipe(gulp.dest(config.dist.fonts)).on('finish', done);
  };

  async.parallel([handleGlyphs, handleFonts], callback);
}

function bumpVersion() {
  var opts = { type: config.bump.allowed[0] };
  var args = minimist(process.argv.slice(2));
  for (var i = 0; i < config.bump.allowed.length; i++) {
    if (args[config.bump.allowed[i]]) { opts.type = config.bump.allowed[i] }
  }
  return gulp.src(config.bump.files)
    .pipe(bump(opts).on('error', util.log))
    .pipe(gulp.dest('./'));
}

function addChanges() {
  return gulp.src('.').pipe(git.add());
}

function storeChanges(callback) {
  exec(config.git.staged, function(error, stdout, stderr) {
    var data = stdout.split('\n');
    for (var i = 0; i < data.length; i++) {
      if (data[i].indexOf('src/svg/') === 0) {
        modifiedIcons.push(data[i].split('/').pop());
      }
    }
    callback();
  });
}

function commitChanges() {
  var message = config.git.defaultCommitMessage;
  if (modifiedIcons.length) {
    message = _.template(config.git.modifiedIconsCommitMessage)({
      icons: modifiedIcons.join(', ')
    });
  }
  return gulp.src('.').pipe(git.commit(message));
}

function pushChanges(callback) {
  git.push(config.git.upstream, config.git.branch, callback);
}

function createNewTag(callback) {
  var version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
  var commitMessage = 'Created Tag for version: ' + version;
  git.tag(version, commitMessage, function (error) {
    if (error) { return callback(error); }
    git.push(config.git.upstream, config.git.branch, { args: '--tags' }, callback);
  });
}

function makeChangelog() {
  return conventionalChangelog({ preset: 'angular', releaseCount: 0 })
    .pipe(fs.createWriteStream('./CHANGELOG.md'));
}

function commitChangelog(callback) {
  return gulp.src('./CHANGELOG.md')
    .pipe(git.add())
    .pipe(git.commit('chore(changelog)'));
}

function readMe() {
  console.log(fs.readFileSync('README.md', 'utf8'));
}

function addIcons(callback) {
  runSequence(
    'ಠ-cleanDist',
    'ಠ-generateFonts',
    'ಠ-bumpVersion',
    'ಠ-addChanges',
    'ಠ-storeChanges',
    'ಠ-commitChanges',
    'ಠ-pushChanges',
    'ಠ-createNewTag',
    'ಠ-makeChangelog',
    'ಠ-commitChangelog',
    'ಠ-pushChanges',
    function (error) {
      console.log(error ? error.message : config.success);
      callback(error);
    }
  );
}

gulp.task('ಠ-cleanDist', cleanDist);
gulp.task('ಠ-generateFonts', generateFonts);
gulp.task('ಠ-bumpVersion', bumpVersion);
gulp.task('ಠ-addChanges', addChanges);
gulp.task('ಠ-storeChanges', storeChanges);
gulp.task('ಠ-commitChanges', commitChanges);
gulp.task('ಠ-pushChanges', pushChanges);
gulp.task('ಠ-createNewTag', createNewTag);
gulp.task('ಠ-makeChangelog', makeChangelog);
gulp.task('ಠ-commitChangelog', commitChangelog);

gulp.task('default', readMe);
gulp.task('icons', addIcons);
