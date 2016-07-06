module.exports = Object.freeze({
  fontName: 'brand-icons',
  fontFormats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
  fontPathFromStyles: '../fonts/',
  bump: {
    package: './package.json',
    allowed: ['patch', 'minor', 'major']
  },
  git: {
    upstream: 'origin',
    branch: 'master',
    defaultCommitMessage: 'chore(update): Automated build',
    changedIconsCommitMessage: 'feat(icons): <%= icons %>',
    tagCommitMessage: 'Created tag for version: <%= version %>'
  },
  src: {
    svg: './src/svg/*.svg',
    templates: './src/templates/**/*.*'
  },
  dist: {
    root: './dist',
    fonts: './dist/fonts',
    styles: './dist/styles'
  },
  changelog: {
    src: './CHANGELOG.md'
  },
  done: [
    '', '',
    '================================================================================',
    '== Font name: <%= fontName %>',
    '== Font version: <%= version %>',
    '== Status: <%= message %>',
    '================================================================================',
    '', ''
  ]
});
