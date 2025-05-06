const { copyFile, GetCopyFileParam } = require('./components/copyFile.mjs');
const fs = require('fs');
const filesNameCache = new Set();

export function checkForNewFiles() {
    const settingsApp = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
    const folderName = Object.keys(settingsApp);
    folderName.forEach((key) => {
        fs.readdir(settingsApp[key].folderPath, (err, files) => {
            if (err) {
                return console.error('Ошибка при чтении директории:', err);
            } else if (files.length) {
                files.forEach((file) => {
                    if (!filesNameCache.has(file)) {
                        filesNameCache.add(file);
                        const copyFileParam = new GetCopyFileParam(file, settingsApp[key], filesNameCache);
                        copyFile(copyFileParam);
                    }
                })
            }
        })
    })
}