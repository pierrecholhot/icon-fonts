var gulp = require('gulp');
var git = require('gulp-git');
var util = require('gulp-util');
var bump = require('gulp-bump');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');
var rename = require('gulp-rename');

var async = require('async');
var fs = require('fs');
var ms = require('minimist');
var rs = require('run-sequence');

var timestamp = Math.round(Date.now() / 1000);

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

function makeFont(done){

	var iconStream = gulp.src(config.src.svg).pipe(iconfont({
	  fontName: config.fontName,
	  formats: config.fontFormats,
	  prependUnicode: false,
	  timestamp: timestamp
	}));

	function handleGlyphs (cb) {
		iconStream.on('glyphs', function(glyphs, options) {
			gulp.src(config.src.templates)
				.pipe(consolidate('lodash', {
					glyphs: glyphs,
					fontName: config.fontName,
					fontPath: config.fontPathFromStyles,
					cssClass: config.fontName
				}))
				.pipe(rename(function(path){
					if (path.basename !== 'font-face'){ path.basename = config.fontName; }
				}))
				.pipe(gulp.dest(config.dist.styles))
				.on('finish', cb);
		});
	}

	function handleFonts (cb) {
		iconStream.pipe(gulp.dest(config.dist.fonts)).on('finish', cb);
	}

	async.parallel([handleGlyphs, handleFonts], done);
}

function bumpVersion () {
  var opts = { type: config.bump.allowed[0] };
  var args = ms(process.argv.slice(2));
  for (var i = 0; i < config.bump.allowed.length; i++) {
    if (args[config.bump.allowed[i]]) { opts.type = config.bump.allowed[i] };
  }
  return gulp.src(config.bump.files)
    .pipe(bump(opts).on('error', util.log))
    .pipe(gulp.dest('./'));
}

function commitChanges () {
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit('[Release] Add icons '));
}

function pushChanges (cb) {
  git.push(config.git.upstream, config.git.branch, cb);
}

function createNewTag (cb) {
  var version = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  var commitMessage = 'Created Tag for version: ' + version;
  git.tag(version, commitMessage, function (error) {
    if (error) { return cb(error); }
    git.push(config.git.upstream, config.git.branch, { args: '--tags' }, cb);
  });
}

function clean (callback) {
  return require('del')(config.dist.root, callback);
}

function defaultTask (callback) {
  rs(
    'clean',
    'make-font-files',
    'bump-version',
    'commit-changes',
    'push-changes',
    'create-new-tag',
    function (error) {
      var status = error ? error.message : config.success;
			console.log(status);
      callback(error);
    });
}

gulp.task('make-font-files', makeFont);
gulp.task('bump-version', bumpVersion);
gulp.task('commit-changes', commitChanges);
gulp.task('push-changes', pushChanges);
gulp.task('create-new-tag', createNewTag);
gulp.task('clean', clean);
gulp.task('default', defaultTask);
