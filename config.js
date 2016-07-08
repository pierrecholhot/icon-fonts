module.exports = Object.freeze({

  fontName: 'brand-icons',
  fontFormats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
  fontPathFromStyles: '../fonts/',

  bump: {
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
    templates: './src/templates/**/*.*',
    changelog: './CHANGELOG.md',
    readme: './README.md',
    package: './package.json'
  },

  dist: {
    root: './dist',
    fonts: './dist/fonts',
    styles: './dist/styles'
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
