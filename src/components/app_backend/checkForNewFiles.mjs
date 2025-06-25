const { copyFile, GetCopyFileParam } = require('./components/app_backend/copyFile.mjs');
const fs = require('fs');
const chokidar = require('chokidar');
// const filesNameCache = new Set();

// export function checkForNewFiles(param) {
//     const settingsApp = JSON.parse(fs.readFileSync(param.settingsFile, 'utf8'));
//     const folderName = Object.keys(settingsApp);
//     folderName.forEach((key) => {
//         fs.readdir(settingsApp[key].folderPath, (err, files) => {
//             if (err) {
//                 return console.error('Ошибка при чтении директории:', err);
//             } else if (files.length) {
//                 files.forEach((file) => {
//                     if (!filesNameCache.has(file)) {
//                         filesNameCache.add(file);
//                         const copyFileParam = new GetCopyFileParam(file, settingsApp[key], filesNameCache);
//                         const date = new Date();
//                         const message = copyFileParam.messageResult.copyFileError + date.toLocaleDateString(copyFileParam.optionsDate.lang, copyFileParam.optionsDate.options);
//                         param.addLogMessage(message, param.messageColor.notification);
//                         setTimeout(() => { copyFile(copyFileParam, param) }, 2000);
//                     }
//                 })
//             }
//         })
//     })
// }

export class CheckForNewFiles {
    settingsFileDir
    settingsApp
    rootFoldersPath
    watcher
    constructor(settingsFile) {
        this.settingsFileDir = settingsFile
        this.settingsApp = JSON.parse(fs.readFileSync(settingsFile, 'utf8'))
    }
    #setRootFoldersPath() {
        this.rootFoldersPath = []
        const settingKeys = Object.keys(this.settingsApp)
        if (settingKeys.length) {
            settingKeys.forEach((key) => {
                this.rootFoldersPath.push(this.settingsApp[key].folderPath)
            })
        } else {
            console.log('Добавьте папку для отслеживания')
        }
    }
    #copyFileInit(path, param) {
        const fileName = path.split('\\').slice(-1)[0]
        const rootName = path.split('\\').slice(-2)[0]
        const copyFileParam = new GetCopyFileParam(fileName, this.settingsApp[rootName]);
        const date = new Date();
        const message = copyFileParam.messageResult.copyFileError + date.toLocaleDateString(copyFileParam.optionsDate.lang, copyFileParam.optionsDate.options);
        param.addLogMessage(message, param.messageColor.notification);
        setTimeout(() => { copyFile(copyFileParam, param) }, 500);
    }
    watchPlay(param) {
        this.#setRootFoldersPath()
        this.watcher = chokidar.watch(this.rootFoldersPath)
        this.watcher
            .on('change', path => this.#copyFileInit(path, param))
        // .on('unlink', path => copyFile(path))
    }
    watchStop() {
        this.watcher.unwatch(this.rootFoldersPath)
        this.watcher.close()
    }
}

function copyFiles(pathFile) {
    console.log(pathFile)
}