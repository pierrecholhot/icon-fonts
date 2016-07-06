module.exports = Object.freeze({
  fontName: 'brand-icons',
  fontFormats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
  fontPathFromStyles: '../fonts/',
  bump: {
    files: './package.json',
    allowed: ['patch', 'minor', 'major']
  },
  git: {
    upstream: 'origin',
    branch: 'master',
    modifiedIconsCommitMessage: 'feat(icons): <%= icons %>',
    defaultCommitMessage: 'chore(update): Automated build'
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
  success: [
    '',
    '========================================================================',
    '| <%= fontName %> version <%= version %> release finished successfully |',
    '========================================================================',
    ''
  ]
});
