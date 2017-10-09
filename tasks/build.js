const fs = require('fs');
const path = require('path');
const engine = require('Mustache');

const SRC = './src';
const TARGET = './themes';
const THEME_STYLES_DIR =  path.join(SRC, 'styles');
const TEMPLATE_PATH = path.join(SRC, 'theme.json');
const CHARSET = 'utf-8';

const themeTemplate = fs.readFileSync(TEMPLATE_PATH, CHARSET);
const themes = fs.readdirSync(THEME_STYLES_DIR)
    .reduce(function(files, filename) {
        const filePath = path.join(THEME_STYLES_DIR, filename);
        const themeFile = fs.readFileSync(filePath, CHARSET);
        try {
            files.push(JSON.parse(themeFile));
        } catch (error) {
            console.error('Failed to parse theme config', error);
        }
        return files;
    }, []);

themes.forEach(config => {
    const outputPath = path.join(TARGET, config.name + '.json');
    const outputTheme = engine.render(themeTemplate, config);
    fs.writeFileSync(outputPath, outputTheme, { encoding: CHARSET });
    console.log('Output: ', outputPath);
});
