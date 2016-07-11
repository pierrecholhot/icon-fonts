var config = require('./config');
var gulp = require('gulp');

var git = require('gulp-git');
var util = require('gulp-util');
var bump = require('gulp-bump');
var rename = require('gulp-rename');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');

var _ = require('lodash');
var fs = require('fs');
var del = require('del');
var exec = require('child_process').exec;
var async = require('async');
var minimist = require('minimist');
var changelog = require('conventional-changelog');
var runSequence = require('run-sequence');

var changedIcons = [];

var bumpMap = {
  'add': 'patch',
  'edit': 'minor',
  'delete': 'major'
};

function cleanDist(callback) {
  return del(config.dist.root, callback);
}

function generateFonts(callback) {
  var iconStream = gulp.src(config.src.svg).pipe(iconfont({
    fontName: config.fontName,
    formats: config.fontFormats,
    normalize: true
  }));

  var handleGlyphs = function (done) {
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

  var handleFonts = function (done) {
    iconStream.pipe(gulp.dest(config.dist.fonts)).on('finish', done);
  };

  async.parallel([handleGlyphs, handleFonts], callback);
}

function getBumpType(v) {
  var action, args = minimist(process.argv.slice(2));
  if (args.add) { action = 'add'; }
  if (args.edit) { action = 'edit'; }
  if (args.delete) { action = 'delete'; }
  if (!action) { action = 'add'; }
  return v ? action : bumpMap[action];
}

function bumpVersion() {
  return gulp.src(config.src.package)
    .pipe(bump({type: getBumpType()}).on('error', util.log))
    .pipe(gulp.dest('./'));
}

function addChanges() {
  return gulp.src('.').pipe(git.add());
}

function storeChanges(callback) {
  exec('git diff --name-only --staged', function(error, stdout, stderr) {
    var data = stdout.split('\n');
    for (var i = 0; i < data.length; i++) {
      if (data[i].indexOf('src/svg/') === 0) {
        changedIcons.push(data[i].split('/').pop());
      }
    }
    callback();
  });
}

function commitChanges() {
  var message = config.git.defaultCommitMessage;
  if (changedIcons.length) {
    message = _.template(config.git.changedIconsCommitMessage)({
      action: getBumpType(true),
      icons: changedIcons.join(', ')
    });
  }
  return gulp.src('.').pipe(git.commit(message));
}

function pushChanges(callback) {
  git.push(config.git.upstream, config.git.branch, callback);
}

function parseVersion() {
  return JSON.parse(fs.readFileSync(config.src.package, 'utf8')).version;
}

function createNewTag(callback) {
  var version = parseVersion();
  var commitMessage = _.template(config.git.tagCommitMessage)({ version: version });
  git.tag(version, commitMessage, function (error) {
    if (error) { return callback(error); }
    git.push(config.git.upstream, config.git.branch, { args: '--tags' }, callback);
  });
}

function generateChangelog() {
  return changelog({ preset: 'angular', releaseCount: 0 })
    .pipe(fs.createWriteStream(config.src.changelog));
}

function commitChangelog(callback) {
  return gulp.src(config.src.changelog)
    .pipe(git.add())
    .pipe(git.commit('chore(changelog)'));
}

function readMe() {
  console.log(fs.readFileSync(config.src.readme, 'utf8'));
}

function finish(error, message) {
  console.log(_.template(config.done.join('\n'))({
    fontName: config.fontName,
    version: parseVersion(),
    message: error ? error.message : message
  }));
}

function allIcons(callback) {
  runSequence(
    'ಠ-cleanDist',
    'ಠ-generateFonts',
    'ಠ-bumpVersion',
    'ಠ-addChanges',
    'ಠ-storeChanges',
    'ಠ-commitChanges',
    'ಠ-pushChanges',
    function (error) {
      finish(error, 'Icons updated! Don\'t forget to `gulp tag` when you are finished');
      callback(error);
    }
  );
}

function tagVersion(callback) {
  runSequence(
    'ಠ-createNewTag',
    'ಠ-generateChangelog',
    'ಠ-commitChangelog',
    'ಠ-pushChanges',
    function (error) {
      finish(error, 'Release finished successfully!');
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
gulp.task('ಠ-generateChangelog', generateChangelog);
gulp.task('ಠ-commitChangelog', commitChangelog);

gulp.task('default', readMe);
gulp.task('icons', allIcons);
gulp.task('tag', tagVersion);
