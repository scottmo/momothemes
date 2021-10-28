const fs = require("fs");
const path = require("path");

const THEME_PREFIX = 'Momo';
const TEMPLATE_PATH = path.join("src", "Momo.json");
const STYLES_PATH = path.join("src", "styles");
const BUILD_PATH = "build";
const BUILD_THEMES_PATH = path.join(BUILD_PATH, "themes");

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
    const packageJson = readJSON("package.json");
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
    writeJSON(path.join(BUILD_PATH, "package.json"), packageJson);
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
