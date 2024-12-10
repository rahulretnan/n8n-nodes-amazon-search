const { src, dest } = require('gulp');

function buildIcons() {
  return src('./nodes/**/*.svg')
    .pipe(dest('./dist/icons'));
}

exports.build = buildIcons;
exports['build:icons'] = buildIcons;