const gulp = require('gulp');
const mustache = require('gulp-mustache');
const rename = require('gulp-rename');
const path = require('path');

const SRC = 'src';
const DST = 'build';

gulp.task('themes', function() {
    const templateFile = path.join(SRC, 'Momo.json');
    const dataFiles = [
        'Dark',
        'Light',
        'OneDark',
        'SolDark',
        'SolLight'
    ].map(name => name + '.json');

    dataFiles.forEach(dataFile => {
        gulp.src(templateFile)
            .pipe(mustache(path.join(SRC, 'styles', dataFile)))
            .pipe(rename('Momo' + dataFile))
            .pipe(gulp.dest(path.join(DST, 'themes')));
    });
});

gulp.task('package', function() {
    gulp.src('*.md').pipe(gulp.dest(DST));
    gulp.src('package.json').pipe(gulp.dest(DST));
});

gulp.task('default', ['themes', 'package']);
