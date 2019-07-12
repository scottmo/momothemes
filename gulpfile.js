const { src, dest, parallel } = require('gulp');
const mustache = require('gulp-mustache');
const rename = require('gulp-rename');
const path = require('path');

const SRC = 'src';
const DST = 'build';

function buildThemes(done) {
    const templateFile = path.join(SRC, 'Momo.json');
    const dataFiles = [
        'Dark',
        'Light',
        'OneDark',
        'SolDark',
        'SolLight'
    ].map(name => name + '.json');

    dataFiles.forEach(dataFile => {
        src(templateFile)
            .pipe(mustache(path.join(SRC, 'styles', dataFile)))
            .pipe(rename('Momo' + dataFile))
            .pipe(dest(path.join(DST, 'themes')));
    });
    done();
};

function buildPackage(done) {
    src('*.md').pipe(dest(DST));
    src('package.json').pipe(dest(DST));
    done();
};

exports.buildThemes = buildThemes;
exports.buildPackage = buildPackage;
exports.default = parallel(buildThemes, buildPackage);
