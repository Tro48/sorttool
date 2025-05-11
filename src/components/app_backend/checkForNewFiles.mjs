const { copyFile, GetCopyFileParam } = require('./components/app_backend/copyFile.mjs');
const fs = require('fs');
const filesNameCache = new Set();

export function checkForNewFiles(param) {
    const settingsApp = JSON.parse(fs.readFileSync(param.settingsFile, 'utf8'));
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
                        const date = new Date();
                        const message = copyFileParam.messageResult.copyFileError + date.toLocaleDateString(copyFileParam.optionsDate.lang, copyFileParam.optionsDate.options);
                        param.addLogMessage(message, param.messageColor.notification);
                        setTimeout(() => { copyFile(copyFileParam, param) }, 2000);
                    }
                })
            }
        })
    })
}