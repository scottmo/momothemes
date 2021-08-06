const { src, dest, parallel } = require('gulp');
const mustache = require('gulp-mustache');
const rename = require('gulp-rename');
const path = require('path');
const fs = require('fs');

const themePrefix = 'Momo';
const dataFiles = fs.readdirSync(path.join('src', 'styles'));

function buildThemes(done) {
    const templateFile = path.join('src', 'Momo.json');    
    dataFiles.forEach(fileName => {
        src(templateFile)
            .pipe(mustache(path.join('src', 'styles', fileName)))
            .pipe(rename(themePrefix + fileName))
            .pipe(dest(path.join('build', 'themes')));
    });
    done();
};

function buildPackage(done) {
    buildPackageJSON();

    src('*.md').pipe(dest('build'));
    done();
};

// update package.json with theme information and move it to build/
function buildPackageJSON() {
    const packageJson = JSON.parse(fs.readFileSync('./package.json'));
    packageJson.contributes = { themes: [] };
    dataFiles.forEach(fileName => {
        const themeName = themePrefix +
                fileName.substring(0, fileName.indexOf('.json'));
        packageJson.contributes.themes.push({
            label: themeName,
            uiTheme: themeName.includes('Light') ? 'vs' : 'vs-dark',
            path: `./themes/${themeName}.json`
        });
    });
    fs.writeFileSync('./build/package.json', JSON.stringify(packageJson, null, 4));
}

exports.buildThemes = buildThemes;
exports.buildPackage = buildPackage;
exports.default = parallel(buildThemes, buildPackage);
