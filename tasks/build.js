const fs = require('fs');
const path = require('path');
const engine = require('Mustache');

const SRC = './src';
const TARGET = './themes';

buildThemes('Momo', SRC, TARGET);

// ------------------------------

function withJsonExt(filename) {
    return filename + '.json';
}

function loadJsonFiles(themesDir) {
    return fs.readdirSync(themesDir).reduce(function(files, filename) {
        const filePath = path.join(themesDir, filename);
        const themeFile = fs.readFileSync(filePath, 'utf8');
        try {
            files.push(JSON.parse(themeFile));
        } catch (error) {
            console.error("Failed to parse theme config", error);
        }
        return files;
    }, []);
}

function buildThemes(themplateName, srcDir, targetDir) {
    const templatePath = path.join(srcDir, withJsonExt(themplateName));
    const themesDir = path.join(srcDir, 'styles');
    const themeTemplate = fs.readFileSync(templatePath, 'utf8');

    loadJsonFiles(themesDir).forEach(config => {
        config.name = themplateName + config.name;
        const outputPath = path.join(targetDir, withJsonExt(config.name));
        const outputTheme = engine.render(themeTemplate, config);
        fs.writeFile(outputPath, outputTheme, 'utf8', err => {
            if (err) throw err;
            console.log('Output: ', outputPath);
        });
    });
}
