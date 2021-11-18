const fs = require("fs");
const path = require("path");

const THEME_PREFIX = 'Momo';
const TEMPLATE_PATH = path.join("src", "template.json");
const STYLES_PATH = path.join("src", "styles");
const BUILD_THEMES_PATH = path.join("build", "themes");

const styleFileList = fs.readdirSync(STYLES_PATH);

buildThemes(styleFileList);
buildPackageJSON(styleFileList);

// helpers

function buildThemes(styleFileList) {
    const template = readJSON(TEMPLATE_PATH);

    for (const styleFileName of styleFileList) {
        const style = readJSON(path.join(STYLES_PATH, styleFileName));
        const theme = insertTemplateValues(template, style);
        writeJSON(path.join(BUILD_THEMES_PATH, THEME_PREFIX + styleFileName), theme);
    }
}

function buildPackageJSON(styleFileList) {
    const inputPath = path.join("src", "package.json");
    const outputPath = path.join("build", "package.json");

    const packageJson = readJSON(inputPath);
    packageJson.contributes = { themes: [] };
    styleFileList.forEach(fileName => {
        const themeName = THEME_PREFIX +
                fileName.substring(0, fileName.indexOf('.json'));
        packageJson.contributes.themes.push({
            label: themeName,
            uiTheme: themeName.includes('Light') ? 'vs' : 'vs-dark',
            path: `./themes/${themeName}.json`
        });
    });
    writeJSON(outputPath, packageJson);
}

function insertTemplateValues(json, values) {
    const isArray = Array.isArray(json);
    const newJson = isArray ? [] : {};
    for (const key in json) {
        const value = json[key];
        let newValue = value;
        if (typeof value === "string") {
            const matcher = /{{([\w.]+)}}/.exec(value);
            if (matcher) {
                const valuePath = matcher[1].split(".");
                const replacedValue = valuePath.reduce((currentValue, pathKey) => {
                    return currentValue[pathKey];
                }, values);
                newValue = value.replace(matcher[0], replacedValue);
            }
        } else {
            newValue = insertTemplateValues(value, values);
        }
        if (isArray) {
            newJson.push(newValue);
        } else {
            newJson[key] = newValue;
        }
    }
    return newJson;
}

function readJSON(path) {
    return JSON.parse(fs.readFileSync(path, "utf-8"));
}
function writeJSON(path, json) {
    fs.writeFileSync(path, JSON.stringify(json, null, 4));
}
