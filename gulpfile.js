const { src, dest, parallel } = require('gulp');
const mustache = require('gulp-mustache');
const rename = require('gulp-rename');
const path = require('path');
const fs = require('fs');

function buildThemes(done) {
    const templateFile = path.join('src', 'Momo.json');
    const dataFiles = fs.readdirSync(path.join('src', 'styles'));
    dataFiles.forEach(dataFile => {
        src(templateFile)
            .pipe(mustache(path.join('src', 'styles', dataFile)))
            .pipe(rename('Momo' + dataFile))
            .pipe(dest(path.join('build', 'themes')));
    });
    done();
};

function buildPackage(done) {
    src('*.md').pipe(dest('build'));
    src('package.json').pipe(dest('build'));
    done();
};

exports.buildThemes = buildThemes;
exports.buildPackage = buildPackage;
exports.default = parallel(buildThemes, buildPackage);
